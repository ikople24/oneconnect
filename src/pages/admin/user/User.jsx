import UserManageTable from "@/components/admin/user-manage/ui/UserManageTable";
import TitlePage from "@/components/ui/Admin/TitlePage";

const User = () => {
  return (
    <>
      <TitlePage title={"จัดการผู้ใช้งาน"} />
      <div>
        <UserManageTable />
      </div>
    </>
  );
};

export default User;
