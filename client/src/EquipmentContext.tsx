import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getEquipmentTree } from "./service/equipment.service";
import { Equipment, EquipmentTree } from "./interfaces";
import { useUser } from "./UserContext";

type EquipmentContextType = {
  equipment: EquipmentTree | null;
  equipmentTypes: string[];
  equipmentNames: (typeName: string) => string[];
  populateEquipment: () => void;
};

const EquipmentContext = createContext<EquipmentContextType | undefined>(
  undefined
);

type EquipmentProviderProps = {
  children: ReactNode;
};

const EquipmentProvider: React.FC<EquipmentProviderProps> = ({ children }) => {
  const { user } = useUser();
  const [equipment, setEquipment] = useState<EquipmentTree | null>(() => {
    const storedEquipment = localStorage.getItem("equipment");
    return storedEquipment ? JSON.parse(storedEquipment) : null;
  });

  const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);

  const equipmentNames = (typeName: string): string[] => {
    if (!equipment) return [];
    const type = equipment.find(
      (typeObj: any) => typeObj.typeName === typeName
    ) as Equipment;
    return type ? type.names.map((nameObj: any) => nameObj.name) : [];
  };

  const populateEquipment = async () => {
    if (user) {
      const equipment = await getEquipmentTree(user.id);
      localStorage.setItem("equipment", JSON.stringify(equipment));
      setEquipment(equipment);

      const types: any = equipment.map((typeObj: any) => typeObj.typeName);
      setEquipmentTypes(types);
    }
  };

  useEffect(() => {
    populateEquipment();
  }, [user]);

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        equipmentTypes,
        equipmentNames,
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
