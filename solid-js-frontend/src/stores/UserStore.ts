import { createStore } from "solid-js/store";

const [userData, setUserData] = createStore({
	userData: {},
	isFirstTime: true,
});

export { userData, setUserData };
