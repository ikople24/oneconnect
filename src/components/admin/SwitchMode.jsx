import { Flex, Switch } from "antd";

export const SwitchMode = (props) => {
  const { isAdmin, setIsAdmin } = props;

  return (
    <div className="mb-2">
      <div className="text-xl mb-2 font-bold">สลับบทบาท</div>
      <Flex gap={5}>
        <div>ผู้ใช้งาน</div>
        <div>
          <Switch onChange={() => setIsAdmin(!isAdmin)} />
        </div>
        <div>ผู้ดูแลระบบ</div>
      </Flex>
    </div>
  );
};
