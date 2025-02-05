import React, { useState } from "react";
import "./TableComponent.css";
const TableComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([
    {
      name: "หน่วยงาน A",
      address: "123/45",
      subdistrict: "ตำบล 1",
      district: "อำเภอ 1",
      province: "จังหวัด 1",
      postalCode: "10100",
    },
    {
      name: "หน่วยงาน B",
      address: "678/90",
      subdistrict: "ตำบล 2",
      district: "อำเภอ 2",
      province: "จังหวัด 2",
      postalCode: "10200",
    },
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
  });

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData(data[index]);
  };

  const handleSave = () => {
    const updatedData = [...data];
    updatedData[editIndex] = editData;
    setData(updatedData);
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" table-container p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className=" table-title  text-2xl font-bold text-center text-blue-700">ตารางแก้ไขข้อมูล</h2>
      <div className=" flex items-center gap-2">
        <input
          type="text"
          placeholder="🔍 ค้นหา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input:focus border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className=" search-button bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-sky-600 transition duration-200">
          ค้นหา
        </button>
      </div>

      <table className="data-table w-full border border-gray-300 shadow-sm rounded-md overflow-hidden">
        <thead>
          <tr className="data-table th bg-gray-100 text-gray-700">
            <th className="p-3 border">ชื่อหน่วยงาน</th>
            <th className="p-3 border">ที่อยู่</th>
            <th className="p-3 border">ตำบล</th>
            <th className="p-3 border">อำเภอ</th>
            <th className="p-3 border">จังหวัด</th>
            <th className="p-3 border">รหัสไปรษณีย์</th>
            <th className="p-3 border">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-blue-50 transition duration-150"
            >
              {editIndex === index ? (
                <>
                  {Object.keys(editData).map((key) => (
                    <td key={key} className="border p-2">
                      <input
                        type="text"
                        value={editData[key]}
                        onChange={(e) =>
                          setEditData({ ...editData, [key]: e.target.value })
                        }
                        className="border rounded-md p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </td>
                  ))}
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white rounded-md px-3 py-1 hover:bg-green-600 transition"
                    >
                      ✅ บันทึก
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="bg-gray-500 text-white rounded-md px-3 py-1 hover:bg-gray-600 transition"
                    >
                      ❌ ยกเลิก
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2 text-center">{item.name}</td>
                  <td className="border p-2 text-center">{item.address}</td>
                  <td className="border p-2 text-center">{item.subdistrict}</td>
                  <td className="border p-2 text-center">{item.district}</td>
                  <td className="border p-2 text-center">{item.province}</td>
                  <td className="border p-2 text-center">{item.postalCode}</td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition"
                    >
                      ✏️ แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      🗑️ ลบ
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;