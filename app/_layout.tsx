import React from 'react';
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "@/src/database/initializeDatabase";
import { Tabs } from "expo-router";

const Layout: React.FC = () => {
  return (
    <SQLiteProvider databaseName="MyDatabase.db" onInit={initializeDatabase}>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="compras" options={{ title: 'Compras' }} />
      </Tabs>
    </SQLiteProvider>
  );
};

export default Layout;