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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <Package className="h-8 w-8 text-pink-500" />
              <h1 className="text-2xl font-bold">Order Management</h1>
            </div>
            <div className="text-sm text-gray-600">
              Total Orders: <span className="font-bold text-gray-900">{orders.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600">Orders will appear here once customers start placing them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getOrderTypeBadge(order.orderType)}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Customer Info */}
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {order.customerPhone}
                        </p>
                        {order.customerEmail && (
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {order.customerEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getDeliveryMethodBadge(order.deliveryMethod)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{order.deliveryAddress}</p>
                        {order.city && (
                          <p className="text-sm text-gray-600">
                            {order.city}, {order.state} - {order.pincode}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-primary-600">₹{order.totalAmount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{expandedOrder === order.id ? 'Hide Details' : 'View Details'}</span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {/* Status Update Dropdown */}
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Update Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="NEW">New</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>


                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Items */}
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Package className="h-5 w-5 mr-2 text-primary-600" />
                            Order Items ({order.orderItems.length})
                          </h4>
                          <div className="space-y-3">
                            {order.orderItems.map((item, index) => (
                              <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-3 last:border-0">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{item.productName}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                  <p className="text-sm text-gray-600">Unit Price: ₹{item.unitPrice}</p>
                                  {item.customizationCharge > 0 && (
                                    <p className="text-sm text-accent-600">
                                      Customization: +₹{item.customizationCharge}
                                    </p>
                                  )}
                                </div>
                                <p className="font-bold text-primary-600">₹{item.totalPrice}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hamper Items */}
                      {order.orderHampers && order.orderHampers.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Package className="h-5 w-5 mr-2 text-accent-600" />
                            Custom Hampers ({order.orderHampers.length})
                          </h4>
                          <div className="space-y-3">
                            {order.orderHampers.map((hamper, index) => (
                              <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                                <p className="font-medium text-gray-900">{hamper.hamperBoxName}</p>
                                <p className="text-sm text-gray-600">Box Price: ₹{hamper.hamperBoxPrice}</p>
                                <p className="text-sm text-gray-600">Items Total: ₹{hamper.itemsTotal}</p>
                                {hamper.withArrangement && (
                                  <p className="text-sm text-accent-600">
                                    Arrangement Charge: +₹{hamper.arrangementCharge}
                                  </p>
                                )}
                                <p className="font-bold text-primary-600 mt-2">Total: ₹{hamper.totalPrice}</p>
                              </div>
                            ))}
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


