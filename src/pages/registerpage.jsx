import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        province: "",
        district: "",
        subdistrict: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (formData.id) {
                setIsLoading(true);
                try {
                    const response = await fetch(`http://localhost:8000/api/data/${formData.id}`);
                    const data = await response.json();
                    setFormData({
                        ...formData,
                        name: data.name || "",
                        province: data.province || "",
                        district: data.district || "",
                        subdistrict: data.subdistrict || "",
                    });
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [formData.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert("Form submitted successfully!");
            } else {
                alert("Failed to submit form.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#1a5976] to-[#0FA4AF] p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">ลงทะเบียนหน่วยงาน</h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {[
                        // { label: "ID", name: "id", placeholder: "", disabled: true },
                        { label: "ชื่อหน่วยงาน", name: "name", placeholder: "", disabled: isLoading },
                        { label: "จังหวัด", name: "province", placeholder: "", disabled: isLoading },
                        { label: "อำเภอ", name: "district", placeholder: "", disabled: isLoading },
                        { label: "ตำบล", name: "subdistrict", placeholder: "", disabled: isLoading },
                    ].map(({ label, name, placeholder, disabled }) => (
                        <div key={name}>
                            <label className="block text-gray-700 font-medium mb-1">{label}</label>
                            <input
                                type="text"
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                                placeholder={placeholder}
                                disabled={disabled}
                            />
                        </div>
                    ))}
                   <div className="flex space-x-4">
    <Link to="/welcome" className="flex-1">
        <button
            type="button"
            className="w-full bg-gray-300 text-white p-3 rounded-xl text-lg font-semibold transition hover:bg-gray-500"
        >
            ย้อนกลับ
        </button>
    </Link>

    <button
        type="submit"
        className={`flex-1 w-full bg-[#0FA4AF] text-white p-3 rounded-xl text-lg font-semibold transition hover:bg-cyan-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLoading}
    >
        {isLoading ? "กำลังโหลด..." : "ลงทะเบียน"}
    </button>
</div>

                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;