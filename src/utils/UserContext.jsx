import { createContext, useEffect, useState } from "react";
import { generateUID } from "./Hooks";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [allUsersData, setAllUsersData] = useState([
        { id: generateUID(), fullName: "John Doe", firstName: "John", lastName: "Doe", email: "john@example.com", role: "Admin" },
        { id: generateUID(), fullName: "Jane Smith", firstName: "Jane", lastName: "Smith", email: "jane@example.com", role: "Editor" },
        { id: generateUID(), fullName: "Sam Wilson", firstName: "Sam", lastName: "Wilson", email: "sam@example.com", role: "Viewer" },
        { id: generateUID(), fullName: "Sara Connor", firstName: "Sara", lastName: "Connor", email: "sara@example.com", role: "Editor" },
        { id: generateUID(), fullName: "Michael Brown", firstName: "Michael", lastName: "Brown", email: "michael@example.com", role: "Admin" },
        { id: generateUID(), fullName: "Emily Davis", firstName: "Emily", lastName: "Davis", email: "emily@example.com", role: "Viewer" },
        { id: generateUID(), fullName: "Chris Johnson", firstName: "Chris", lastName: "Johnson", email: "chris@example.com", role: "Editor" },
        { id: generateUID(), fullName: "Olivia Taylor", firstName: "Olivia", lastName: "Taylor", email: "olivia@example.com", role: "Viewer" },
        { id: generateUID(), fullName: "Daniel Lee", firstName: "Daniel", lastName: "Lee", email: "daniel@example.com", role: "Admin" },
        { id: generateUID(), fullName: "Sophia Martinez", firstName: "Sophia", lastName: "Martinez", email: "sophia@example.com", role: "Editor" },
        { id: generateUID(), fullName: "Ethan White", firstName: "Ethan", lastName: "White", email: "ethan@example.com", role: "Viewer" },
        { id: generateUID(), fullName: "Isabella Moore", firstName: "Isabella", lastName: "Moore", email: "isabella@example.com", role: "Admin" },
        { id: generateUID(), fullName: "James Harris", firstName: "James", lastName: "Harris", email: "james@example.com", role: "Editor" },
        { id: generateUID(), fullName: "Mia Clark", firstName: "Mia", lastName: "Clark", email: "mia@example.com", role: "Viewer" },
        { id: generateUID(), fullName: "Lucas Lewis", firstName: "Lucas", lastName: "Lewis", email: "lucas@example.com", role: "Admin" },
        { id: generateUID(), fullName: "Ava Walker", firstName: "Ava", lastName: "Walker", email: "ava@example.com", role: "Editor" },
        { id: generateUID(), fullName: "Benjamin Hall", firstName: "Benjamin", lastName: "Hall", email: "benjamin@example.com", role: "Viewer" },
        { id: generateUID(), fullName: "Charlotte Allen", firstName: "Charlotte", lastName: "Allen", email: "charlotte@example.com", role: "Editor" },
        { id: generateUID(), fullName: "Henry Young", firstName: "Henry", lastName: "Young", email: "henry@example.com", role: "Admin" },
        { id: generateUID(), fullName: "Amelia King", firstName: "Amelia", lastName: "King", email: "amelia@example.com", role: "Viewer" },
    ])

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            setAllUsersData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify(allUsersData));
    }, [allUsersData]);

    const updatedUserList = (data) => {
        setAllUsersData(data)
    }

    // state to check if user is login or not
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    return (
        <UserContext.Provider value={{ allUsersData, setAllUsersData, updatedUserList, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    )
}

