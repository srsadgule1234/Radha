export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'रॉयल ब्लू येवला पैठणी',
    price: 12500,
    description: 'मोर आणि पोपटाच्या नक्षीकामासह पारंपारिक येवला पैठणी.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    category: 'येवला पैठणी'
  },
  {
    id: '2',
    name: 'एमराल्ड ग्रीन सिल्क पैठणी',
    price: 15800,
    description: 'फुलांच्या नक्षीकामासह उत्कृष्ट रेशमी पैठणी.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    category: 'शुद्ध रेशीम'
  },
  {
    id: '3',
    name: 'क्रिमसन रेड ब्राइडल पैठणी',
    price: 24000,
    description: 'जड पदर आणि पारंपारिक मुनिया बॉर्डरसह भव्य लग्नाची पैठणी.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    category: 'लग्नासाठी'
  },
  {
    id: '4',
    name: 'गोल्डन येल्लो पेशवाई पैठणी',
    price: 18500,
    description: 'दोलायमान पिवळ्या रंगात पारंपारिक नक्षीकामासह क्लासिक पेशवाई शैलीतील पैठणी.',
    image: 'https://images.unsplash.com/photo-1610030469668-935142b96fe4?auto=format&fit=crop&q=80&w=800',
    category: 'पेशवाई'
  },
  {
    id: '5',
    name: 'मॅजेंटा पिंक सेमी-पैठणी',
    price: 8500,
    description: 'सण आणि समारंभांसाठी योग्य अशी मोहक सेमी-पैठणी.',
    image: 'https://images.unsplash.com/photo-1610030469915-03077f229521?auto=format&fit=crop&q=80&w=800',
    category: 'सेमी-पैठणी'
  },
  {
    id: '6',
    name: 'पर्पल डिझायनर पैठणी',
    price: 21000,
    description: 'पारंपारिक विणकाम आणि आधुनिक रंगांचा मेळ असलेली डिझायनर पैठणी.',
    image: 'https://images.unsplash.com/photo-1610030469613-255d49f05955?auto=format&fit=crop&q=80&w=800',
    category: 'डिझायनर'
  }
];
