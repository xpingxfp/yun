
import { Menu } from "../../scripts/menu.js";

const menu = new Menu("Node.js 菜单");

function 彩蛋() {
    console.log("🎉🎉🎉 彩蛋 🎉🎉🎉");
}

menu.addItem("彩蛋", 彩蛋);

menu.show();