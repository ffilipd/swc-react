import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getEquipmentTree } from "./service/equipment.service";
import { Equipment, EquipmentTree } from "./interfaces";

type EquipmentContextType = {
  equipment: EquipmentTree | null;
  populateEquipment: () => void;
};

const EquipmentContext = createContext<EquipmentContextType | undefined>(
  undefined
);

type EquipmentProviderProps = {
  children: ReactNode;
};

const EquipmentProvider: React.FC<EquipmentProviderProps> = ({ children }) => {
  const [equipment, setEquipment] = useState<EquipmentTree | null>(() => {
    const storedEquipment = localStorage.getItem("equipment");
    return storedEquipment ? JSON.parse(storedEquipment) : null;
  });

  const populateEquipment = async () => {
    const equipment = await getEquipmentTree();
    localStorage.setItem("equipment", JSON.stringify(equipment));
    setEquipment(equipment);
  };

  useEffect(() => {
    populateEquipment();
  }, []);

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        populateEquipment,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

const useEquipment = (): EquipmentContextType => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error("useEquipment must be used within a UserProvider");
  }
  return context;
};

export { EquipmentProvider, useEquipment };
