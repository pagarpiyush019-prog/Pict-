import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption protects your data'
    },
    {
      icon: 'Lock',
      title: 'Data Protection',
      description: 'GDPR compliant with secure data handling'
    },
    {
      icon: 'CheckCircle',
      title: 'Verified Platform',
      description: 'Trusted by 100,000+ users worldwide'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center mb-4">
        <h3 className="text-sm font-medium text-foreground mb-2">Your Security is Our Priority</h3>
        <p className="text-xs text-muted-foreground">
          We use industry-standard security measures to protect your financial information
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustBadges?.map((badge, index) => (
          <div key={index} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/30">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center mb-2">
              <Icon name={badge?.icon} size={16} className="text-success" />
            </div>
            <h4 className="text-xs font-medium text-foreground mb-1">{badge?.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{badge?.description}</p>
          </div>
        ))}
      </div>
      {/* Security Certifications */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">GDPR Compliant</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">SOC 2 Certified</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;