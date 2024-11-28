import { useSQLiteContext } from "expo-sqlite"

export type ProductDatabase = {
    id: number
    compra_id: number
    nome: string
    quantidade: number
    valor: number
}

export function useProductDatabase () {
    const database = useSQLiteContext()


    async function create (data: Omit<ProductDatabase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO produtos (nome, valor, quantidade, compra_id) VALUES ($nome, $valor, $quantidade, $compra_id)"     
        )

        try {
          const result = await statement.executeAsync ({
            $nome: data.nome, 
            $valor: data.valor,
            $quantidade: data.quantidade,
            $compra_id: data.compra_id
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
            const query = "SELECT * FROM Produtos WHERE nome LIKE ?"

            const response = await database.getAllAsync<ProductDatabase>(query, `%${nome}%`)

            return response
        } catch (error) {
            throw error
        }
    }

    const searchByCompraId = async (compraId: number) => {
        try {
          const query = "SELECT * FROM Produtos WHERE compra_id = ?";
          const result = await database.getAllAsync<ProductDatabase>(query, [compraId]);
          return result;
        } catch (error) {
          console.error("Erro ao buscar produtos por compra_id:", error);
          return [];
        }
      };

    return { create, searchByName, searchByCompraId }
}