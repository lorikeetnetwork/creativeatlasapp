import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What happens after I pay?",
    answer: "After completing your payment, your account will be upgraded immediately. For Creator accounts, you can start building your member profile right away. For Business listings, you'll be guided through setting up your business profile with photos, videos, and contact information."
  },
  {
    question: "What's the difference between Creator and Business?",
    answer: "Creator accounts are perfect for individual creatives who want to access community features, events, opportunities, and create a personal portfolio. Business accounts include everything in Creator, plus a listing on the map, a full business profile page, galleries, videos, and contact forms for your creative entity."
  },
  {
    question: "Can I browse the map for free?",
    answer: "Yes! You can browse and explore all creative spaces on the map completely free. Premium features like saving favorites, member profiles, events, and opportunities require a subscription."
  },
  {
    question: "How does the yearly subscription work?",
    answer: "Your subscription renews annually. You maintain full control over your profile and can update it anytime. Cancel anytime before renewal to stop future charges. You'll retain access until the end of your billing period."
  },
  {
    question: "Can I upgrade from Creator to Business?",
    answer: "Absolutely! You can upgrade at any time. We'll prorate the difference for the remainder of your billing period, so you only pay the difference."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee if you're not satisfied with your purchase. Contact our support team for assistance with refunds."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards including Visa, Mastercard, and American Express through our secure payment partner Stripe."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take security seriously. All payments are processed through Stripe's secure infrastructure. Your personal and business data is encrypted and protected with industry-standard security measures."
  }
];

export const PricingFAQ = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">
          Everything you need to know about our pricing and plans
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <AccordionItem 
              value={`item-${index}`} 
              className="border-b border-border/50"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-primary transition-colors py-4 text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  );
};
