import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, User, Phone, Mail, MapPin, Calendar,
  Truck, FileText, DollarSign, CheckCircle, Clock, XCircle,
  Eye, ChevronDown, ChevronUp
} from 'lucide-react';
import api from '../config/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      NEW: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      CONFIRMED: { color: 'bg-yellow-100 text-yellow-800', icon: CheckCircle },
      IN_PROGRESS: { color: 'bg-purple-100 text-purple-800', icon: Package },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.NEW;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {status}
      </span>
    );
  };

  const getDeliveryMethodBadge = (method) => {
    if (method === 'COURIER_DELIVERY') {
      return <span className="text-sm text-accent-600 font-medium">Courier Delivery</span>;
    }
    return <span className="text-sm text-primary-600 font-medium">Direct Delivery</span>;
  };

  const getOrderTypeBadge = (type) => {
    if (type === 'HAMPER_ARRANGEMENT') {
      return <span className="text-sm bg-accent-100 text-accent-800 px-2 py-1 rounded">Custom Hamper</span>;
    }
    return <span className="text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded">Direct Purchase</span>;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 lg:pb-8">
      {/* Mobile-First Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors tap-target"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </button>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              <h1 className="text-lg sm:text-2xl font-bold text-white">Orders</h1>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-xs sm:text-sm text-white font-bold">{orders.length} Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 sm:h-16 sm:w-16 text-gray-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-sm sm:text-base text-gray-600">Orders will appear here once customers start placing them.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                {/* Mobile-First Order Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  {/* Order Number & Status - Mobile Stack */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-lg text-sm">
                          #{order.orderNumber}
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getOrderTypeBadge(order.orderType)}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Mobile-Optimized Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {/* Customer Info Card */}
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-blue-600 font-medium mb-1">Customer</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{order.customerName}</p>
                          <a href={`tel:${order.customerPhone}`} className="text-xs text-gray-600 flex items-center mt-1 hover:text-blue-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {order.customerPhone}
                          </a>
                          {order.customerEmail && (
                            <a href={`mailto:${order.customerEmail}`} className="text-xs text-gray-600 flex items-center mt-1 hover:text-blue-600 truncate">
                              <Mail className="h-3 w-3 mr-1" />
                              <span className="truncate">{order.customerEmail}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Info Card */}
                    <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                      <div className="flex items-start space-x-2">
                        <div className="bg-green-500 p-2 rounded-lg">
                          <Truck className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-green-600 font-medium mb-1">Delivery</p>
                          <p className="text-sm font-bold text-gray-900">
                            {getDeliveryMethodBadge(order.deliveryMethod)}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{order.deliveryAddress}</p>
                          {order.city && (
                            <p className="text-xs text-gray-600 mt-1">
                              {order.city}, {order.state} - {order.pincode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Total Card */}
                    <div className="bg-purple-50 rounded-xl p-3 border border-purple-200 sm:col-span-2 lg:col-span-1">
                      <div className="flex items-start space-x-2">
                        <div className="bg-purple-500 p-2 rounded-lg">
                          <DollarSign className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-purple-600 font-medium mb-1">Total Amount</p>
                          <p className="text-2xl sm:text-3xl font-bold text-purple-600">₹{order.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile-Friendly Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-xl font-medium transition-colors tap-target shadow-md"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{expandedOrder === order.id ? 'Hide Details' : 'View Full Details'}</span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {/* Status Update Dropdown - Mobile Optimized */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <label className="text-xs sm:text-sm text-gray-600 font-medium">Update Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className="px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white tap-target"
                      >
                        <option value="NEW">🆕 New</option>
                        <option value="CONFIRMED">✅ Confirmed</option>
                        <option value="IN_PROGRESS">🔄 In Progress</option>
                        <option value="DELIVERED">📦 Delivered</option>
                        <option value="CANCELLED">❌ Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>


                {/* Expanded Order Details - Mobile Optimized */}
                {expandedOrder === order.id && (
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Order Items - Mobile Friendly */}
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                            <div className="bg-primary-100 p-2 rounded-lg mr-2">
                              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                            </div>
                            Order Items ({order.orderItems.length})
                          </h4>
                          <div className="space-y-3">
                            {order.orderItems.map((item, index) => (
                              <div key={index} className="flex justify-between items-start bg-gray-50 rounded-xl p-3 border border-gray-200">
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-gray-900 text-sm sm:text-base mb-1">{item.productName}</p>
                                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                      Qty: {item.quantity}
                                    </span>
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                      ₹{item.unitPrice} each
                                    </span>
                                    {item.customizationCharge > 0 && (
                                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                        +₹{item.customizationCharge} custom
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="font-bold text-primary-600 text-base sm:text-lg ml-2">₹{item.totalPrice}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hamper Items - ENHANCED Mobile-First with Prominent Screenshot */}
                      {order.orderHampers && order.orderHampers.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 sm:p-6 lg:col-span-2 border-2 border-purple-300 shadow-xl">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-900 flex items-center text-base sm:text-lg">
                              <div className="bg-purple-500 p-2 rounded-lg mr-2">
                                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                              </div>
                              🎁 Custom Hampers ({order.orderHampers.length})
                            </h4>
                          </div>
                          <div className="space-y-4 sm:space-y-6">
                            {order.orderHampers.map((hamper, index) => {
                              let hamperDetails = null;
                              try {
                                hamperDetails = hamper.hamperData ? JSON.parse(hamper.hamperData) : null;
                              } catch (e) {
                                console.error('Failed to parse hamper data:', e);
                              }

                              return (
                                <div key={index} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-purple-200">
                                  {/* Hamper Header - Mobile Optimized */}
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                                    <div>
                                      <h5 className="font-bold text-lg sm:text-xl text-gray-900 flex items-center gap-2">
                                        <span className="text-2xl">🎁</span>
                                        {hamper.hamperName || `Hamper #${index + 1}`}
                                      </h5>
                                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                        <span className="text-base">📦</span>
                                        {hamper.hamperBoxName}
                                      </p>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl">
                                      <p className="text-xs font-medium">Total Price</p>
                                      <p className="text-2xl sm:text-3xl font-bold">₹{hamper.totalPrice}</p>
                                    </div>
                                  </div>

                                  {/* PROMINENT Screenshot Display - Mobile First */}
                                  {hamper.screenshot && (
                                    <div className="mb-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-400 shadow-lg">
                                      <div className="flex items-center justify-between mb-3">
                                        <h6 className="font-bold text-base sm:text-lg text-gray-900 flex items-center gap-2">
                                          <span className="text-2xl">📸</span>
                                          Customer's Arrangement
                                        </h6>
                                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                                          IMPORTANT
                                        </span>
                                      </div>
                                      <div className="bg-white rounded-xl p-2 shadow-md">
                                        <img
                                          src={hamper.screenshot}
                                          alt={`${hamper.hamperName} arrangement`}
                                          className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-200"
                                        />
                                      </div>
                                      <div className="mt-3 bg-yellow-100 border-2 border-yellow-400 rounded-xl p-3">
                                        <p className="text-sm font-bold text-yellow-900 text-center flex items-center justify-center gap-2">
                                          <span className="text-xl">⚠️</span>
                                          Arrange items EXACTLY as shown in the image above
                                          <span className="text-xl">⚠️</span>
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  <div className="grid md:grid-cols-2 gap-4">

                                    {/* Box Details - Mobile Friendly */}
                                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 shadow-md">
                                      <h6 className="font-bold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="text-xl">📦</span>
                                        Box Details
                                      </h6>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center bg-white rounded-lg p-2">
                                          <span className="text-gray-600 font-medium">Box Type:</span>
                                          <span className="font-bold text-gray-900">{hamper.hamperBoxName}</span>
                                        </div>
                                        {hamperDetails?.boxDetails?.dimensions && (
                                          <div className="flex justify-between items-center bg-white rounded-lg p-2">
                                            <span className="text-gray-600 font-medium">Dimensions:</span>
                                            <span className="font-bold text-gray-900">{hamperDetails.boxDetails.dimensions}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between items-center bg-white rounded-lg p-2">
                                          <span className="text-gray-600 font-medium">Box Price:</span>
                                          <span className="font-bold text-green-600">₹{hamper.hamperBoxPrice}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Items List - Enhanced Mobile View */}
                                    {hamperDetails?.items && hamperDetails.items.length > 0 && (
                                      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 shadow-md">
                                        <h6 className="font-bold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
                                          <span className="text-xl">🎁</span>
                                          Items in Hamper ({hamperDetails.items.length})
                                        </h6>
                                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                          {hamperDetails.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="bg-white rounded-xl p-3 shadow-sm border border-green-200">
                                              <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1 min-w-0">
                                                  <p className="font-bold text-gray-900 text-sm mb-1">{item.productName}</p>
                                                  <div className="flex flex-wrap gap-1.5">
                                                    {item.position !== undefined && (
                                                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                        📍 Spot {item.position + 1}
                                                      </span>
                                                    )}
                                                    {item.rotation?.needsRotation && (
                                                      <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                        🔄 Laid on side
                                                      </span>
                                                    )}
                                                    {item.quantity > 1 && (
                                                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                        ×{item.quantity}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="text-right">
                                                  <p className="font-bold text-green-600 text-base">₹{item.price}</p>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Price Breakdown - Enhanced */}
                                    <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200 shadow-md">
                                      <h6 className="font-bold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="text-xl">💰</span>
                                        Price Breakdown
                                      </h6>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center bg-white rounded-lg p-2">
                                          <span className="text-gray-600 font-medium">Items Total:</span>
                                          <span className="font-bold text-gray-900">₹{hamper.itemsTotal}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white rounded-lg p-2">
                                          <span className="text-gray-600 font-medium">Box Price:</span>
                                          <span className="font-bold text-gray-900">₹{hamper.hamperBoxPrice}</span>
                                        </div>
                                        {hamper.withArrangement && hamper.arrangementCharge > 0 && (
                                          <div className="flex justify-between items-center bg-orange-100 rounded-lg p-2">
                                            <span className="text-orange-700 font-medium">Arrangement Charge:</span>
                                            <span className="font-bold text-orange-700">+₹{hamper.arrangementCharge}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-3 mt-3">
                                          <span className="font-bold text-base">Grand Total:</span>
                                          <span className="font-bold text-xl">₹{hamper.totalPrice}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Special Instructions */}
                      {order.specialInstructions && (
                        <div className="bg-white rounded-lg p-4 lg:col-span-2">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-gray-600" />
                            Special Instructions
                          </h4>
                          <p className="text-gray-700 whitespace-pre-wrap">{order.specialInstructions}</p>
                        </div>
                      )}

                      {/* Delivery Date */}
                      {order.deliveryDate && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                            Requested Delivery Date
                          </h4>
                          <p className="text-gray-700">
                            {new Date(order.deliveryDate).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Order Timeline */}
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-gray-600" />
                          Order Timeline
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            <span className="font-medium">Created:</span>{' '}
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                          {order.updatedAt && order.updatedAt !== order.createdAt && (
                            <p className="text-gray-700">
                              <span className="font-medium">Last Updated:</span>{' '}
                              {new Date(order.updatedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


