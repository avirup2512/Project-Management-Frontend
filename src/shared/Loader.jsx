import Select from 'react-select'
import { motion } from 'framer-motion';
import "./Loader.css";
function Loader() {

const dotVariants = {
    jump: {
        y: -30,
        transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        },
    },
}
  return (
      <div className='loader'>
        <motion.div
              animate="jump"
              transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
            className="container"
          >
        <motion.div className="dot" variants={dotVariants} />
            <motion.div className="dot" variants={dotVariants} />
            <motion.div className="dot" variants={dotVariants} />
       </motion.div>
    </div>
  );
}

export default Loader;