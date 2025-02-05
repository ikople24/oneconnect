import React, { useState } from "react";
import { Users, Home, Truck, Building, Landmark, GraduationCap, Hotel, FireExtinguisher } from "lucide-react";

const ManageInfoTableWithIconSelect = () => {
  const [data, setData] = useState([
    { id: 1, mainTopic: "ประชากร", quantity: 20000, unit: "คน", icon: <Users className="w-5 h-5 text-primaryAccent" /> },
    { id: 2, mainTopic: "ครัวเรือน", quantity: 250, unit: "ครัวเรือน", icon: <Home className="w-5 h-5 text-primaryAccent" /> },
    { id: 3, mainTopic: "การคมนาคม", quantity: 50, unit: "แห่ง", icon: <Truck className="w-5 h-5 text-primaryAccent" /> },
  ]);

  const [newRow, setNewRow] = useState({ mainTopic: "", quantity: "", unit: "", iconName: "" });
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState({ mainTopic: "", quantity: "", unit: "" });

  const iconOptions = [
    { value: "Users", label: "ประชากร", icon: <Users className="w-5 h-5 text-primaryAccent" /> },
    { value: "Home", label: "ครัวเรือน", icon: <Home className="w-5 h-5 text-primaryAccent" /> },
    { value: "Truck", label: "การคมนาคม", icon: <Truck className="w-5 h-5 text-primaryAccent" /> },
    { value: "Building", label: "สถานที่ราชการ", icon: <Building className="w-5 h-5 text-primaryAccent" /> },
    { value: "Landmark", label: "วัด", icon: <Landmark className="w-5 h-5 text-primaryAccent" /> },
    { value: "GraduationCap", label: "สถานศึกษา", icon: <GraduationCap className="w-5 h-5 text-primaryAccent" /> },
    { value: "Hotel", label: "โรงแรม", icon: <Hotel className="w-5 h-5 text-primaryAccent" /> },
    { value: "FireExtinguisher", label: "สถานีดับเพลิง", icon: <FireExtinguisher className="w-5 h-5 text-primaryAccent" /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow({ ...newRow, [name]: value });
  };

  const handleIconChange = (e) => {
    setNewRow({ ...newRow, iconName: e.target.value });
  };

  const handleAddRow = () => {
    if (newRow.mainTopic && newRow.quantity && newRow.unit && newRow.iconName) {
      const selectedIcon = iconOptions.find((option) => option.value === newRow.iconName)?.icon;
      setData([...data, { id: Date.now(), ...newRow, icon: selectedIcon }]);
      setNewRow({ mainTopic: "", quantity: "", unit: "", iconName: "" });
    }
  };

  const handleDeleteRow = (id) => {
    setData(data.filter((row) => row.id !== id));
  };

  const handleEditClick = (row) => {
    setEditRowId(row.id);
    setEditRowData({ mainTopic: row.mainTopic, quantity: row.quantity, unit: row.unit });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRowData({ ...editRowData, [name]: value });
  };

  const handleSaveEdit = (id) => {
    setData(
      data.map((row) => (row.id === id ? { ...row, ...editRowData } : row))
    );
    setEditRowId(null);
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
  };

  return (
    <div className="min-h-screen bg-primaryBg flex flex-col items-center py-10 px-4">
      <h1 className="text-primaryTitle text-3xl font-bold mb-6">ข้อมูลเมือง</h1>

      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-primaryBase shadow-lg rounded-lg">
          <thead className="bg-primaryAccent text-white">
            <tr>
              <th className="px-4 py-2 text-left">ไอคอน</th>
              <th className="px-4 py-2 text-left">หัวข้อหลัก</th>
              <th className="px-4 py-2 text-left">จำนวน</th>
              <th className="px-4 py-2 text-left">หน่วย</th>
              <th className="px-4 py-2 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-gray-300">
                <td className="px-4 py-2">{row.icon}</td>
                {editRowId === row.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="mainTopic"
                        value={editRowData.mainTopic}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="quantity"
                        value={editRowData.quantity}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="unit"
                        value={editRowData.unit}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2 text-center flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleSaveEdit(row.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                      >
                        บันทึก
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                      >
                        ยกเลิก
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{row.mainTopic}</td>
                    <td className="px-4 py-2">{row.quantity}</td>
                    <td className="px-4 py-2">{row.unit}</td>
                    <td className="px-4 py-2 text-center flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEditClick(row)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        ลบ
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>

          {/* Add New Row */}
          <tfoot>
            <tr className="bg-gray-100">
              {/* Select Icon */}
              <td className="px-4 py-2">
                <select
                  name="icon"
                  value={newRow.iconName}
                  onChange={handleIconChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">เลือกไอคอน</option>
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>

              {/* Main Topic */}
              <td className="px-4 py-2">
                <input
                  type="text"
                  name="mainTopic"
                  value={newRow.mainTopic}
                  onChange={handleInputChange}
                  placeholder="หัวข้อหลัก"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </td>

              {/* Quantity */}
              <td className="px-4 py-2">
                <input
                  type="number"
                  name="quantity"
                  value={newRow.quantity}
                  onChange={handleInputChange}
                  placeholder="จำนวน"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </td>

              {/* Unit */}
              <td className="px-4 py-2">
                <input
                  type="text"
                  name="unit"
                  value={newRow.unit}
                  onChange={handleInputChange}
                  placeholder="หน่วย"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </td>

              {/* Add Button */}
              <td className="px-4 py-2 text-center">
                <button
                  onClick={handleAddRow}
                  className="bg-primaryAccent text-white px-3 py-1 rounded-md hover:bg-primaryContent"
                >
                  เพิ่ม
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ManageInfoTableWithIconSelect;
