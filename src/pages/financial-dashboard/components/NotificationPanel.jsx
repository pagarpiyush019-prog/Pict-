import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPanel = ({ notifications, onDismiss, onViewAll }) => {
  const [expandedNotifications, setExpandedNotifications] = useState(new Set());

  const getNotificationIcon = (type) => {
    const iconMap = {
      'bill_reminder': 'Bell',
      'budget_overage': 'AlertTriangle',
      'goal_milestone': 'Target',
      'investment_alert': 'TrendingUp',
      'security': 'Shield',
      'sync_error': 'AlertCircle'
    };
    return iconMap?.[type] || 'Info';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'bg-error';
    if (priority === 'medium') return 'bg-warning';
    
    const colorMap = {
      'bill_reminder': 'bg-blue-500',
      'budget_overage': 'bg-warning',
      'goal_milestone': 'bg-success',
      'investment_alert': 'bg-purple-500',
      'security': 'bg-error',
      'sync_error': 'bg-error'
    };
    return colorMap?.[type] || 'bg-primary';
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })?.format(new Date(date));
  };

  const toggleExpanded = (notificationId) => {
    const newExpanded = new Set(expandedNotifications);
    if (newExpanded?.has(notificationId)) {
      newExpanded?.delete(notificationId);
    } else {
      newExpanded?.add(notificationId);
    }
    setExpandedNotifications(newExpanded);
  };

  const handleDismiss = (notificationId) => {
    onDismiss(notificationId);
    const newExpanded = new Set(expandedNotifications);
    newExpanded?.delete(notificationId);
    setExpandedNotifications(newExpanded);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        <div className="flex items-center space-x-2">
          {notifications?.length > 3 && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">
              {notifications?.length}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {notifications?.slice(0, 5)?.map((notification) => {
          const isExpanded = expandedNotifications?.has(notification?.id);
          
          return (
            <div key={notification?.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors duration-200">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification?.type, notification?.priority)}`}>
                  <Icon name={getNotificationIcon(notification?.type)} size={14} color="white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {notification?.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification?.timestamp)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {notification?.actionRequired && (
                        <div className="w-2 h-2 bg-error rounded-full" />
                      )}
                      <button
                        onClick={() => handleDismiss(notification?.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      {isExpanded ? notification?.message : `${notification?.message?.substring(0, 80)}${notification?.message?.length > 80 ? '...' : ''}`}
                    </p>
                    
                    {notification?.message?.length > 80 && (
                      <button
                        onClick={() => toggleExpanded(notification?.id)}
                        className="text-xs text-primary hover:text-primary/80 mt-1 transition-colors duration-200"
                      >
                        {isExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                  
                  {notification?.actionButton && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={notification?.actionButton?.onClick}
                      >
                        {notification?.actionButton?.text}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {notifications?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No new notifications</p>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;