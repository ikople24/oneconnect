import { Flex, Switch } from "antd";

export const SwitchMode = (props) => {
  const { isAdmin, setIsAdmin } = props;

  const onChangeMode = ()=>{

    setIsAdmin(!isAdmin)


  }
  return (
    <div className="p-2  border rounded-md">
      <div className="text-xl mb-2">Change role</div>
      <Flex gap={5}>
        <div>User</div>
        <div>
          <Switch onChange={onChangeMode} />
        </div>
        <div>Admin</div>
      </Flex>
    </div>
  );
};
