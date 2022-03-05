import React, {useState, createContext, ReactNode, useContext } from "react";
import { Ingredients } from "../ts/interfaces";

type IngredientsListType = [
    [currentList: Ingredients[], 
    setCurrentList: React.Dispatch<React.SetStateAction<Ingredients[]>>],
    [currentListName: string,
    setCurrentListName: React.Dispatch<React.SetStateAction<string>>]
]

export const IngredientsListContext= createContext<IngredientsListType | undefined>(undefined);

export const useIngredientsListContext = () =>
  useContext(IngredientsListContext) as IngredientsListType;

export const IngredientsListProvider = ({children} : {children : ReactNode}) => {
    return(
        <IngredientsListContext.Provider value={[useState<Ingredients[]>([]), useState<string>("")]}>
            { children }
        </IngredientsListContext.Provider>
    )
};

export default {IngredientsListProvider, useIngredientsListContext}