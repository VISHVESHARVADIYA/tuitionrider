import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919465172269"
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-2xl"
    >
      <MessageCircle size={20} />
      WhatsApp
    </motion.a>
  );
}

export default WhatsAppButton;
