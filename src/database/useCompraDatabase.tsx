import { useSQLiteContext } from "expo-sqlite"

export type CompraDatabase = {
    id: number
    data: string
    descricao: string
}

export function useCompraDatabase () {
    
    const database = useSQLiteContext()

    async function create (data: Omit<CompraDatabase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO compra (data, descricao) VALUES ($data, $descricao) "      
        )

        try {
          const result = await statement.executeAsync ({
            $data: data.data, 
            $descricao: data.descricao,
          })  

          const insertedRowId = result.lastInsertRowId.toLocaleString()

          return { insertedRowId }
        } catch (error) {
            throw error
        } finally {
           await statement.finalizeAsync() 
        }
    }

    async function searchByName (data: string) {

        try {
            const query = "SELECT * FROM compra WHERE data LIKE ?"

            const response = await database.getAllAsync<CompraDatabase>(query, `%${data}%`)

            return response
        } catch (error) {
            throw error
        }
    }

    async function remove (id: number) {
        try{
          await database.execAsync ("DELETE FROM compra WHERE id = " + id)
        } catch (error) {
          throw error
        }
    }

    async function show(id:number) {
        try {
            const query = "SELECT * FROM compra WHERE id = ?"

            const response = await database.getFirstAsync<CompraDatabase> (query, [id])

            return response
        } catch (error) {
            throw error
        }
    }

    return { create, searchByName, remove, show }
}