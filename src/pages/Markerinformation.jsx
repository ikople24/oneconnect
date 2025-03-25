// import { useState, useEffect } from "react";

// export default function RegisterSeniorForm() {
//     const [formData, setFormData] = useState({
//         category: "",
//         citizenId: "",
//         prefix: "",
//         firstName: "",
//         lastName: "",
//         birthDate: "",
//         community: "",
//         cityId: "",
//         location: { lat: "", long: "" },
//         age: "",
//     });

//     const [isLocationActive, setIsLocationActive] = useState(true);
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [communities, setCommunities] = useState([]);
//     const [cities, setCities] = useState([]);

//     useEffect(() => {
//         // ดึงข้อมูลชุมชนจาก backend
//         fetch("/api/communities")
//             .then((response) => response.json())
//             .then((data) => setCommunities(data));

//         // ดึงข้อมูลรหัสเมืองจาก backend
//         fetch("/api/cities")
//             .then((response) => response.json())
//             .then((data) => setCities(data));
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const formatCitizenId = (value) => {
//         const onlyNumbers = value.replace(/\D/g, "");

//         let formatted = onlyNumbers;
//         if (onlyNumbers.length > 1) formatted = onlyNumbers.slice(0, 1) + "-" + onlyNumbers.slice(1);
//         if (onlyNumbers.length > 5) formatted = formatted.slice(0, 5) + "-" + formatted.slice(5);
//         if (onlyNumbers.length > 10) formatted = formatted.slice(0, 10) + "-" + formatted.slice(10);
//         if (onlyNumbers.length > 12) formatted = formatted.slice(0, 13) + "-" + formatted.slice(13);

//         return formatted.slice(0, 17); // จำกัดความยาว
//     };

//     const handleCitizenIdChange = (e) => {
//         const value = e.target.value;

//         // แสดงขีดใน input ขณะกรอกข้อมูล
//         const formattedId = formatCitizenId(value);

//         setFormData((prev) => ({
//             ...prev,
//             citizenId: formattedId,
//         }));
//     };

//     const calculateAge = (birthDate) => {
//         const today = new Date();
//         const birthDateObj = new Date(birthDate);
//         let age = today.getFullYear() - birthDateObj.getFullYear();
//         const month = today.getMonth();
//         if (month < birthDateObj.getMonth() || (month === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
//             age--;
//         }
//         return age;
//     };

//     const handleBirthDateChange = (e) => {
//         const newBirthDate = e.target.value;
//         setFormData((prev) => ({
//             ...prev,
//             birthDate: newBirthDate,
//             age: calculateAge(newBirthDate),
//         }));
//     };

//     const getLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const lat = position.coords.latitude;
//                     const long = position.coords.longitude;
//                     setFormData((prev) => ({
//                         ...prev,
//                         location: { lat: lat.toFixed(6), long: long.toFixed(6) },
//                     }));
//                     console.log("ตำแหน่งที่ได้รับ:", lat, long);
//                 },
//                 (error) => {
//                     console.error("เกิดข้อผิดพลาดในการดึงตำแหน่ง", error);
//                 },
//                 {
//                     enableHighAccuracy: true,
//                     maximumAge: 0,
//                 }
//             );
//         } else {
//             console.log("ไม่รองรับการใช้งาน Geolocation");
//         }
//     };

//     const handleSubmit = () => {
//         const citizenIdWithoutHyphen = formData.citizenId.replace(/-/g, "");

//         const payload = {
//             geometry: {
//                 type: "Point",
//                 coordinates: [parseFloat(formData.location.long), parseFloat(formData.location.lat)],
//             },
//             properties: {
//                 name: formData.firstName + " " + formData.lastName,
//                 markerType: formData.selectedCategory,
//                 users: {
//                     firstName: formData.firstName,
//                     lastName: formData.lastName,
//                     gender: formData.prefix,
//                     IdCard: citizenIdWithoutHyphen,
//                     birthDate: formData.birthDate,
//                     age: formData.age,

//                 },
//             },
//         };

//         if (!isLocationActive) {
//             delete payload.geometry.coordinates;
//         }

//         fetch("http://localhost:3000/markers", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 console.log("Marker created successfully:", data);
//             })
//             .catch((error) => {
//                 console.error("Error creating marker:", error);
//             });

//     };

//     return (
//         <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
//             <h2 className="text-xl font-semibold text-gray-800 text-center">📝 ลงทะเบียนคนเมือง</h2>

//             {/* ประเภทข้อมูล */}
//             <div>
//                 <label className="block text-gray-700 text-sm font-medium">ประเภทข้อมูล</label>
//                 <select
//                     name="community"
//                     className="bg-gray-50 border border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                     placeholder="เ"
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                 >
//                     <option value="" disabled>เลือก</option>
//                     <option value="ผู้สูงอายุ">ผู้สูงอายุ</option>
//                     <option value="ผู้นำชุมชน">ผู้นำชุมชน</option>
//                     <option value="ปราชญ์ชุมชน">ปราชญ์ชุมชน</option>
//                     <option value="อสม">อสม</option>
//                     <option value="กู้ภัย">กู้ภัย</option>
//                 </select>
//             </div>

//             {/* เลขบัตรประชาชน */}
//             <div>
//                 <label className="block text-gray-600 text-sm">เลขบัตรประชาชน (13 หลัก)</label>
//                 <input
//                     type="text"
//                     name="citizenId"
//                     className="w-full p-2 border rounded text-sm tracking"
//                     value={formData.citizenId}
//                     onChange={handleCitizenIdChange}
//                     maxLength="17"
//                     placeholder="กรอกเลขบัตรประชาชน"
//                 />
//             </div>

//             {/* คำนำหน้า, ชื่อ, นามสกุล */}
//             <div>
//                 <label className="block text-gray-700 text-sm font-medium">ชื่อ-นามสกุล</label>
//                 <div className="grid grid-cols-3 gap-2">
//                     <select
//                         name="prefix"
//                         className="bg-gray-50 border border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         value={formData.prefix}
//                         onChange={handleChange}
//                     >
//                         <option value="" disabled>เลือก</option>
//                         <option value="นาย">นาย</option>
//                         <option value="นางสาว">นางสาว</option>
//                         <option value="นาง">นาง</option>
//                     </select>
//                     <input
//                         type="text"
//                         name="firstName"
//                         placeholder="ชื่อ"
//                         className="p-2 border rounded text-sm "
//                         value={formData.firstName}
//                         onChange={handleChange}
//                     />
//                     <input
//                         type="text"
//                         name="lastName"
//                         placeholder="นามสกุล"
//                         className="p-2 border rounded text-sm "
//                         value={formData.lastName}
//                         onChange={handleChange}
//                     />
//                 </div>
//             </div>

//             {/* วันเกิด & อายุ */}
//             <div className="grid grid-cols-2 gap-2">
//                 <div>
//                     <label className="block text-gray-700 text-sm font-medium">วันเกิด</label>
//                     <input
//                         type="date"
//                         name="birthDate"
//                         className="w-full p-2 border rounded"
//                         value={formData.birthDate}
//                         onChange={handleBirthDateChange}
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-gray-700 text-sm font-medium">อายุ (ปี)</label>
//                     <input
//                         type="text"
//                         name="age"
//                         value={formData.age}
//                         readOnly
//                         className="w-full p-2 border rounded bg-gray-100"
//                     />
//                 </div>
//             </div>

//             {/* ชุมชน */}
//             <div>
//                 <label className="block text-gray-700 text-sm font-medium">ชุมชน</label>
//                 <select
//                     name="community"
//                     className="w-full p-2 border rounded text-sm "
//                     value={formData.community}
//                     onChange={handleChange}
//                 >
//                     {communities.map((community) => (
//                         <option key={community.id} value={community.name}>
//                             {community.name}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {/* รหัสเมือง */}
//             <div>
//                 <label className="block text-gray-700 text-sm font-medium">รหัสเมือง</label>
//                 <input
//                     type="text"
//                     name="cityId"
//                     placeholder="รหัสเมือง"
//                     className="w-full p-2 border rounded text-sm "
//                     value={formData.cityId}
//                     onChange={handleChange}
//                 />
//             </div>

//             {/* ปุ่มเลือกตำแหน่ง */}
//             <div className="flex items-center justify-between">
//                 <label className="text-gray-700 text-sm font-medium">ใช้ตำแหน่ง</label>
//                 <div className="flex items-center space-x-4">
//                     <input type="radio" id="enableLocation" checked={isLocationActive} onChange={() => setIsLocationActive(true)} />
//                     <label htmlFor="enableLocation">เปิด</label>
//                     <input type="radio" id="disableLocation" checked={!isLocationActive} onChange={() => setIsLocationActive(false)} />
//                     <label htmlFor="disableLocation">ปิด</label>
//                 </div>
//             </div>

//             {/* ปุ่มอนุญาตตำแหน่ง */}
//             <button
//                 className={`w-full p-2 text-white rounded ${isLocationActive ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"}`}
//                 onClick={getLocation}
//                 disabled={!isLocationActive}
//             >
//                 อนุญาตใช้ตำแหน่ง
//             </button>

//             {/* Lat & Long */}
//             <div className="grid grid-cols-2 gap-2">
//                 <input
//                     type="text"
//                     name="lat"
//                     placeholder="ละติจูด"
//                     className="p-2 border rounded bg-gray-100"
//                     value={formData.location.lat}
//                     readOnly
//                     disabled={!isLocationActive}
//                 />
//                 <input
//                     type="text"
//                     name="long"
//                     placeholder="ลองจิจูด"
//                     className="p-2 border rounded bg-gray-100"
//                     value={formData.location.long}
//                     readOnly
//                     disabled={!isLocationActive}
//                 />
//             </div>

//             {/* ปุ่มลงทะเบียน */}
//             <button
//                 type="button"
//                 className="w-full p-2 bg-green-500 text-white rounded"
//                 onClick={handleSubmit}
//             >
//                 ลงทะเบียน
//             </button>
//         </div>
//     );
// }
