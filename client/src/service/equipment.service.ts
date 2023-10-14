import { equipment as data } from "../equipment"


interface Equipment {
    [key: string]: {
        type: string;
        name: string;
        swc_number: string;
        size?: string; // Optional property for windsurfing boards and sails
    };
}

const equipment: Equipment = data;

export const getEquipmentTypes = () => {
    const uniqueTypes: Set<string> = new Set();
    // Loop through the equipment object and add unique types to the Set
    for (const key in equipment) {
        if (equipment.hasOwnProperty(key)) {
            const type: string = equipment[key].type;
            uniqueTypes.add(type);
        }
    }
    // Convert the Set back to an array
    const uniqueTypesArray: string[] = Array.from(uniqueTypes);
    return uniqueTypesArray;
}
export const getEquipmentNamesByType = (type: string): string[] => {
    const uniqueNames: Set<string> = new Set();
    // Loop through the equipment object and add unique names of the specified type to the Set
    for (const key in equipment) {
        if (equipment.hasOwnProperty(key)) {
            const equipmentItem = equipment[key];
            if (equipmentItem.type === type) {
                uniqueNames.add(equipmentItem.name);
            }
        }
    }
    // Convert the Set back to an array
    const uniqueNamesArray: string[] = Array.from(uniqueNames);
    return uniqueNamesArray;
}
export const getNumbersByTypeAndName = (targetType: string, targetName: string): string[] => {
    const matchingNumbers: string[] = [];
    // Loop through the equipment object and add numbers of the specified type and name to the array
    for (const key in equipment) {
        if (equipment.hasOwnProperty(key)) {
            const equipmentItem = equipment[key];
            if (equipmentItem.type === targetType && equipmentItem.name === targetName) {
                matchingNumbers.push(equipmentItem.swc_number);
            }
        }
    }

    return matchingNumbers;
}