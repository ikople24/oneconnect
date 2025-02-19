import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const slides = [
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0346.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0355.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0382.JPG",
  },
  // { type: "video", src: "src/assets/video/VID20250116110451.mp4" },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0567.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0375.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0415.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0549.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0432.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0460.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0493.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image/main/DSC_0497.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image2/main/DSC_0535.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image2/main/DSC_0560.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image2/main/DSC_0556.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image2/main/DSC_0589.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image2/main/DSC_0604.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image2/main/DSC_0614.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image2/main/DSC_0661.JPG",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/jujumeldy3/image2/main/DSC_0571.JPG",
  },
];

const footer = [
  {
    src: "src/assets/logo/สายสุนีย์ พันธุ์พานิช.jpeg",
  },
  {
    src: "src/assets/logo/อว.jpg",
  },
];

const definition = [
  {
    src: "src/assets/logo/คำนิยาม.jpg",
  },
];

const background = [
  {
    src: "src/assets/logo/หน่วยงานที่เกี่ยวข้อง.png",
  },
];

const logo = [
  { type: "image", src: "src/assets/logo/เทศบาลตำบลแม่จัน.png" },
  { type: "image", src: "src/assets/logo/เทศบาลตำบลลำพญา.jpeg" },
  { type: "image", src: "src/assets/logo/อบจ.ตรัง.jpeg" },
  { type: "image", src: "src/assets/logo/Privacy Thailand.png" },
  { type: "image", src: "src/assets/logo/เทศบาลเมืองสะเดา.png" },
  { type: "image", src: "src/assets/logo/องค์การบริหารส่วนตำบลม่วงคำ.png" },
  { type: "image", src: "src/assets/logo/เทศบาลนครขอนแก่น.png" },
  { type: "image", src: "src/assets/logo/สายสุนีย์ พันธุ์พานิช.jpeg" },
  { type: "image", src: "src/assets/logo/เทศบาลเมืองแพร่.jpeg" },
];

export default function Homepage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen inset-0 bg-black bg-opacity-50 ">
    {/* <div className="container mx-auto py-4">  */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden ">
        <AnimatePresence exitBeforeEnter>
          {slides.map((slide, i) =>
            i === index ? (
              <motion.div
                key={i}
                className="absolute w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                {slide.type === "image" ? (
                  <img
                    src={slide.src}
                    className="w-full h-full object-cover brightness-75"
                    alt="Slide"
                  />
                ) : (
                  <video
                    src={slide.src}
                    className="w-full h-full object-cover brightness-75"
                    autoPlay
                    loop
                    muted
                  />
                )}
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* โลโก้ที่มุมซ้ายบน */}
        <div className="absolute top-1 left-2">
          <img src="src/assets/logotest.png" alt="Logo" className="w-20" />
        </div>

        {/* ข้อความที่มุมซ้ายล่าง */}
        <div className="absolute bottom-8 left-8 text-white p-4 rounded-lg">
          <motion.h1
            className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00fff0] to-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ONE CONNECT
          </motion.h1>
          <motion.h1
            className="text-3xl font-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          ></motion.h1>
          <motion.div
            className="mt-4 flex space-x-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/register-an-agency">
              <button className="px-4 py-2 bg-[#0FA4AF] text-white rounded-full">
                ลงทะเบียนใช้งาน
              </button>
            </Link>
            <button className="px-4 py-2 bg-[#024950] text-white rounded-full">
              เข้าสู่ระบบ
            </button>
          </motion.div>
        </div>
      </section>
      {/* Section 2: คำนิยาม */}
      <section className="">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative ">
            <img
              src={definition[0].src}
              alt={definition[0].title}
              className="w-auto h-full object-cover mx-auto"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {definition[0].title}
            </h2>
          </motion.div>
        </motion.div>
      </section>
      {/* Section 3: หน่วยงานที่เกี่ยวข้อง */}
      <section
        className="py-20 px-6 text-center bg-white relative"
        style={{
          backgroundImage: `url(${background[0].src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-white font-bold pb-10" style={{ fontSize: "32px" }}>
          หน่วยงานที่เข้าร่วม
        </h2>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {logo.map((item, index) => {
            const { ref, inView } = useInView({
              triggerOnce: true,
              threshold: 0.2,
            });

            return (
              <motion.div
                key={index}
                ref={ref}
                className="bg-white shadow-lg rounded-xl p-4 w-40 h-40 flex items-center justify-center border"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <img
                  src={item.src}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer className="bg-gradient-to-r from-[#1a5976] to-[#0FA4AF] text-blue py-2 ">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          {/* ด้านซ้าย: ชื่อบริษัท */}
          <div
            className="bg-clip-text text-transparent bg-gradient-to-r from-[#00fff0] to-white font-bold font-size"
            style={{ fontSize: "20px" }}
          >
            oneconnect
          </div>

          {/* ด้านขวา: โลโก้ */}
          <div className="flex items-center space-x-4">
            <img
              src="src/assets/logo/บพท.jpg"
              alt="บพท"
              className="h-10 object-contain"
            />
            <img
              src="src/assets/logo/สทสว.png"
              alt="สทสว"
              className="h-10 object-contain"
            />
            <img
              src="src/assets/logo/logo.jpg"
              alt="logo"
              className="h-10 object-contain"
            />
            <img
              src="src/assets/logo/อว.jpg"
              alt="อว"
              className="h-10 object-contain"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
