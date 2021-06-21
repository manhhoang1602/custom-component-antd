import React, {useState} from "react";
import {UploadOutlined} from "@ant-design/icons";
import {Menu} from "antd";
import {Link} from "react-router-dom";

interface ISingleMenu {
    key: string
    value: string
    path: string
    icon?: React.ReactNode
}

interface ISubMenu {
    key: string
    value: string
    icon?: React.ReactNode
    listChild: ISingleMenu []
}

interface IGroupItem {
    key: string,
    title: string
    listChild: ISingleMenu []
}

interface IGroupMenu {
    key: string
    value: string
    icon?: React.ReactNode
    listChild: IGroupItem []
}

interface IDataMenu {
    type: "SINGLE_MENU" | "SUB_MENU" | "GROUP_MENU"
    item: ISingleMenu | ISubMenu | IGroupMenu

}

const dataMenu: IDataMenu [] = [
    {
        type: "SINGLE_MENU",
        item: {
            key: "001",
            path: "/home?page=1",
            value: "SINGLE_MENU",
            icon: <UploadOutlined/>,
        } as ISingleMenu,
    },
    {
        type: "SUB_MENU",
        item: {
            key: "002",
            value: "SUB_MENU",
            icon: <UploadOutlined/>,
            listChild: [
                {
                    key: "002_01",
                    path: "/home/002_01",
                    value: "SUB_MENU_1",
                },
                {
                    key: "002_02",
                    path: "/home/002_02",
                    value: "SUB_MENU_2",
                },
            ],
        } as ISubMenu,
    },
    {
        type: "GROUP_MENU",
        item: {
            key: "003",
            value: "GROUP_MENU",
            icon: undefined,
            listChild: [
                {
                    key: "003_01",
                    title: "GROUP_MENU_1",
                    listChild: [
                        {
                            key: "003_01_01",
                            path: "/home/003_01_01",
                            value: "GROUP_MENU",
                        },
                        {
                            key: "003_01_02",
                            path: "/home/003_01_02",
                            value: "GROUP_MENU",
                        },
                    ],
                },
                {
                    key: "003_02",
                    title: "GROUP_MENU_1",
                    listChild: [
                        {
                            key: "003_02_01",
                            path: "/home/003_02_01",
                            value: "GROUP_MENU",
                        },
                    ],
                },
            ],
        } as IGroupMenu,
    },
];

const MenuComponent: React.FC<any> = () => {

    const [collaped, setCollaped] = useState<boolean>(false);
    const [statusCollaped, setStatusCollaped] = useState<boolean>(false);

    const expandMenu = (event: "onMouseEnter" | "onMouseLeave") => {
        if (statusCollaped && event === "onMouseEnter") {
            setCollaped(false);
        }
        if (statusCollaped && event === "onMouseLeave") setCollaped(true);
    }

    const openKey = (dataMenu: IDataMenu[]): { openKey: string, key: string } => {
        const {pathname} = window.location;
        let result: { openKey: string, key: string } = {openKey: "", key: ""};

        dataMenu.forEach(value => {

            const itemSingle = value.item as ISingleMenu;
            const itemSub = value.item as ISubMenu;
            const itemGroup = value.item as IGroupMenu;

            const getResult = (item: ISingleMenu): boolean => {
                if (item.path.split("?")[0] === pathname) {
                    result.key = item.key;
                    return true;
                }
                return false;
            };

            if (value.type === "SINGLE_MENU") {
                if (getResult(itemSingle)) result.openKey = itemSingle.key;
            } else if (value.type === "SUB_MENU") {
                itemSub.listChild.forEach(value1 => {
                    if (getResult(value1)) result.openKey = itemSub.key;
                });
            } else {
                itemGroup.listChild.forEach(value1 => {
                    let check: boolean = false;
                    value1.listChild.forEach(value2 => {
                        if (getResult(value2)) check = true;
                    });
                    if (check) result.openKey = itemGroup.key;
                });
            }
        });
        return result;
    };

    const renderMenuItem = (value: IDataMenu): React.ReactNode => {

        const itemSingle: ISingleMenu = value.item as ISingleMenu;
        const itemSubMenu: ISubMenu = value.item as ISubMenu;
        const itemGroup: IGroupMenu = value.item as IGroupMenu;

        const renderItemSingleMenu = (item: ISingleMenu): React.ReactNode => {
            return (
                <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.path}>
                        {item.value}
                    </Link>
                </Menu.Item>
            );
        };

        if (value.type === "SINGLE_MENU")
            return renderItemSingleMenu(itemSingle);
        else if (value.type === "SUB_MENU")
            return (
                <Menu.SubMenu key={itemSubMenu.key} icon={itemSubMenu.icon} title={itemSubMenu.value}>
                    {
                        itemSubMenu.listChild.map(value1 => renderItemSingleMenu(value1))
                    }
                </Menu.SubMenu>
            );
        else return (
                <Menu.SubMenu key={itemGroup.key} icon={itemGroup.icon} title={itemGroup.value}>
                    {
                        itemGroup.listChild.map(value1 => {
                            return (
                                <Menu.ItemGroup key={value1.key} title={value1.title}>
                                    {
                                        value1.listChild.map(value2 => renderItemSingleMenu(value2))
                                    }
                                </Menu.ItemGroup>
                            );
                        })
                    }
                </Menu.SubMenu>
            );
    };

    return (
        <div
            className={"menu"}
            onMouseEnter={() => expandMenu("onMouseEnter")}
            onMouseLeave={() => expandMenu("onMouseLeave")}
            style={{width: 256}}
        >
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[openKey(dataMenu).key]}
                defaultOpenKeys={[openKey(dataMenu).openKey]}
                inlineCollapsed={collaped}
            >
                {
                    dataMenu.map(value => renderMenuItem(value))
                }
            </Menu>
        </div>
    );
};

export default MenuComponent;