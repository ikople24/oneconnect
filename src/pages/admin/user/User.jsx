import UserManageTable from "@/components/admin/user-manage/ui/UserManageTable";

const User = () => {
  return (
    <>
      <div className="mb-5">
        <div className="text-2xl">จัดการผู้ใช้งาน</div>
      </div>
      <div>
        <UserManageTable />
      </div>
    </>
  );
};

export default User;
