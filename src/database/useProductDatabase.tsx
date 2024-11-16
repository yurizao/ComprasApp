import { useSQLiteContext } from "expo-sqlite"


export type ProductDatabase = {
    id: number
    nome: string
    descricao: string
    valor: number
}

export function useProductDatabase () {
    const database = useSQLiteContext()


    async function create (data: Omit<ProductDatabase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO produtos (nome, valor, descricao) VALUES ($nome, $valor, $descricao) "      
        )

        try {
          const result = await statement.executeAsync ({
            $nome: data.nome, 
            $valor: data.valor,
            $descricao: data.descricao
          })  

          const insertedRowId = result.lastInsertRowId.toLocaleString()

          return { insertedRowId }
        } catch (error) {
            throw error
        } finally {
           await statement.finalizeAsync() 
        }
    }

    async function searchByName (nome: string) {

        try {
            const query = "SELECT * FROM produtos WHERE nome LIKE ?"

            const response = await database.getAllAsync<ProductDatabase>(query, `%${nome}%`)

            return response
        } catch (error) {
            throw error
        }
    }

    return { create, searchByName }
}