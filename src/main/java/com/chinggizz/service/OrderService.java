package com.chinggizz.service;

import com.chinggizz.dto.*;
import com.chinggizz.entity.*;
import com.chinggizz.enums.OrderStatus;
import com.chinggizz.exception.BadRequestException;
import com.chinggizz.exception.OutOfStockException;
import com.chinggizz.exception.PriceMismatchException;
import com.chinggizz.exception.ResourceNotFoundException;
import com.chinggizz.repository.HamperBoxRepository;
import com.chinggizz.repository.OrderRepository;
import com.chinggizz.repository.ProductRepository;
import com.chinggizz.util.OrderNumberGenerator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Order operations
 * Implements stock management and price validation for concurrent order processing
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final HamperBoxRepository hamperBoxRepository;
    private final OrderNumberGenerator orderNumberGenerator;
    private final ObjectMapper objectMapper;
    private final WhatsAppService whatsAppService;
    
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return convertToDTO(order);
    }
    
    public OrderDTO getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return convertToDTO(order);
    }
    
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Create order with stock management and price validation
     * Uses SERIALIZABLE isolation to prevent race conditions
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public OrderDTO createOrder(CreateOrderRequest request) {
        log.info("Creating order for customer: {}", request.getCustomerName());

        // Validate request
        if ((request.getOrderItems() == null || request.getOrderItems().isEmpty()) &&
            (request.getOrderHampers() == null || request.getOrderHampers().isEmpty())) {
            throw new BadRequestException("Order must contain at least one item or hamper");
        }

        // STEP 1: Validate stock availability and prices BEFORE creating order
        validateStockAndPrices(request);

        // STEP 2: Create order
        Order order = Order.builder()
                .orderNumber(orderNumberGenerator.generate())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .deliveryAddress(request.getDeliveryAddress())
                .deliveryDate(request.getDeliveryDate())
                .specialInstructions(request.getSpecialInstructions())
                .status(OrderStatus.NEW)
                .deliveryMethod(request.getDeliveryMethod())
                .orderType(request.getOrderType())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .totalAmount(BigDecimal.ZERO)
                .orderItems(new ArrayList<>())
                .orderHampers(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        // STEP 3: Process order items and decrement stock
        if (request.getOrderItems() != null) {
            for (OrderItemRequest itemRequest : request.getOrderItems()) {
                Product product = productRepository.findById(itemRequest.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemRequest.getProductId()));

                // Decrement stock atomically
                decrementProductStock(product, itemRequest.getQuantity());

                BigDecimal unitPrice = product.getPrice();
                BigDecimal customizationCharge = BigDecimal.ZERO;

                if (product.getIsCustomizable() && itemRequest.getCustomizationData() != null) {
                    customizationCharge = product.getCustomizationCharge();
                }

                BigDecimal itemTotal = unitPrice.add(customizationCharge)
                        .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(itemRequest.getQuantity())
                        .unitPrice(unitPrice)
                        .customizationCharge(customizationCharge)
                        .totalPrice(itemTotal)
                        .customizationData(itemRequest.getCustomizationData())
                        .build();

                order.getOrderItems().add(orderItem);
                totalAmount = totalAmount.add(itemTotal);

                log.info("Added item: {} x{} to order", product.getName(), itemRequest.getQuantity());
            }
        }

        // STEP 4: Process order hampers
        if (request.getOrderHampers() != null) {
            for (OrderHamperRequest hamperRequest : request.getOrderHampers()) {
                HamperBox hamperBox = hamperBoxRepository.findById(hamperRequest.getHamperBoxId())
                        .orElseThrow(() -> new ResourceNotFoundException("HamperBox", "id", hamperRequest.getHamperBoxId()));

                BigDecimal hamperBoxPrice = hamperBox.getPrice();
                BigDecimal itemsTotal = calculateHamperItemsTotal(hamperRequest.getHamperData());
                BigDecimal arrangementCharge = hamperRequest.getWithArrangement() ? BigDecimal.valueOf(100) : BigDecimal.ZERO;
                BigDecimal hamperTotal = hamperBoxPrice.add(itemsTotal).add(arrangementCharge);

                OrderHamper orderHamper = OrderHamper.builder()
                        .order(order)
                        .hamperBox(hamperBox)
                        .hamperBoxPrice(hamperBoxPrice)
                        .itemsTotal(itemsTotal)
                        .totalPrice(hamperTotal)
                        .withArrangement(hamperRequest.getWithArrangement())
                        .arrangementCharge(arrangementCharge)
                        .hamperData(hamperRequest.getHamperData())
                        .build();

                order.getOrderHampers().add(orderHamper);
                totalAmount = totalAmount.add(hamperTotal);

                log.info("Added hamper: {} to order", hamperBox.getName());
            }
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        log.info("Order created successfully: {} with total amount: {}", savedOrder.getOrderNumber(), totalAmount);

        // Send WhatsApp notification to business number
        OrderDTO orderDTO = convertToDTO(savedOrder);
        try {
            whatsAppService.sendOrderNotification(orderDTO);
            log.info("WhatsApp notification sent for order: {}", savedOrder.getOrderNumber());
        } catch (Exception e) {
            log.error("Failed to send WhatsApp notification for order: {}", savedOrder.getOrderNumber(), e);
            // Don't fail the order creation if WhatsApp notification fails
        }

        return orderDTO;
    }

    /**
     * Validate stock availability and prices for all items in the order
     * This prevents race conditions by checking everything upfront
     */
    private void validateStockAndPrices(CreateOrderRequest request) {
        if (request.getOrderItems() != null) {
            for (OrderItemRequest itemRequest : request.getOrderItems()) {
                Product product = productRepository.findById(itemRequest.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemRequest.getProductId()));

                // Check stock availability
                if (product.getStockQuantity() != null && product.getStockQuantity() < itemRequest.getQuantity()) {
                    throw new OutOfStockException(
                        product.getId(),
                        product.getName(),
                        itemRequest.getQuantity(),
                        product.getStockQuantity()
                    );
                }

                // Validate price if provided by client (prevent price manipulation)
                if (itemRequest.getUnitPrice() != null) {
                    if (itemRequest.getUnitPrice().compareTo(product.getPrice()) != 0) {
                        throw new PriceMismatchException(
                            product.getId(),
                            product.getName(),
                            itemRequest.getUnitPrice(),
                            product.getPrice()
                        );
                    }
                }
            }
        }
    }

    /**
     * Atomically decrement product stock
     * This method is called within a SERIALIZABLE transaction to prevent race conditions
     */
    private void decrementProductStock(Product product, Integer quantity) {
        if (product.getStockQuantity() == null) {
            // Product has unlimited stock
            return;
        }

        Integer currentStock = product.getStockQuantity();
        Integer newStock = currentStock - quantity;

        if (newStock < 0) {
            // Double-check stock (in case of concurrent modification)
            throw new OutOfStockException(
                product.getId(),
                product.getName(),
                quantity,
                currentStock
            );
        }

        product.setStockQuantity(newStock);
        productRepository.save(product);

        log.info("Decremented stock for product {}: {} -> {}", product.getName(), currentStock, newStock);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        order.setStatus(status);
        Order updated = orderRepository.save(order);
        return convertToDTO(updated);
    }

    private BigDecimal calculateHamperItemsTotal(String hamperData) {
        try {
            JsonNode hamperNode = objectMapper.readTree(hamperData);
            JsonNode itemsNode = hamperNode.get("items");

            if (itemsNode == null || !itemsNode.isArray()) {
                return BigDecimal.ZERO;
            }

            BigDecimal total = BigDecimal.ZERO;
            for (JsonNode itemNode : itemsNode) {
                Long productId = itemNode.get("productId").asLong();
                int quantity = itemNode.get("quantity").asInt();

                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

                BigDecimal itemPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));
                total = total.add(itemPrice);
            }

            return total;
        } catch (Exception e) {
            throw new BadRequestException("Invalid hamper data format");
        }
    }

    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                .map(this::convertOrderItemToDTO)
                .collect(Collectors.toList());

        List<OrderHamperDTO> orderHamperDTOs = order.getOrderHampers().stream()
                .map(this::convertOrderHamperToDTO)
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .customerEmail(order.getCustomerEmail())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryDate(order.getDeliveryDate())
                .specialInstructions(order.getSpecialInstructions())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryMethod(order.getDeliveryMethod())
                .orderType(order.getOrderType())
                .city(order.getCity())
                .state(order.getState())
                .pincode(order.getPincode())
                .orderItems(orderItemDTOs)
                .orderHampers(orderHamperDTOs)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemDTO convertOrderItemToDTO(OrderItem orderItem) {
        return OrderItemDTO.builder()
                .id(orderItem.getId())
                .productId(orderItem.getProduct().getId())
                .productName(orderItem.getProduct().getName())
                .quantity(orderItem.getQuantity())
                .unitPrice(orderItem.getUnitPrice())
                .customizationCharge(orderItem.getCustomizationCharge())
                .totalPrice(orderItem.getTotalPrice())
                .customizationData(orderItem.getCustomizationData())
                .build();
    }

    private OrderHamperDTO convertOrderHamperToDTO(OrderHamper orderHamper) {
        return OrderHamperDTO.builder()
                .id(orderHamper.getId())
                .hamperBoxId(orderHamper.getHamperBox().getId())
                .hamperBoxName(orderHamper.getHamperBox().getName())
                .hamperBoxPrice(orderHamper.getHamperBoxPrice())
                .itemsTotal(orderHamper.getItemsTotal())
                .totalPrice(orderHamper.getTotalPrice())
                .withArrangement(orderHamper.getWithArrangement())
                .arrangementCharge(orderHamper.getArrangementCharge())
                .hamperData(orderHamper.getHamperData())
                .build();
    }
}
