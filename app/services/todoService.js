import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export function subscribeToTodosChanges(callback) {
  return supabase
    .channel("realtime-todos")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "todos",
      },
      (payload) => {
        console.log("Gelen değişiklik:", payload);
        callback(payload);
      }
    )
    .subscribe();
}

export async function getTodos() {
  const { data, error } = await supabase.from("todos").select("*");

  if (error) {
    console.error("todos alınırken bir hata oluştu,", error);
    return [];
  } else {
    console.log("todos başarıyla alındı:", data);
    return data;
  }
}

export async function addTodo(title) {
  const { data, error } = await supabase
    .from("todos")
    .insert([{ title, completed: false }])
    .select();

  if (error) {
    console.error("todo eklenirken bir hata oluştu", error);
    return null;
  } else {
    console.log("yeni todo başarıyla eklendi:", data);
    return data;
  }
}

export async function updateTodo(id, completed) {
  const { data, error } = await supabase
    .from("todos")
    .update({ completed })
    .match({ id });
  if (error) console.error("Todo güncellenirken bir hata oluştu,", error);
  return data;
}

export async function deleteTodo(id) {
  console.log("silme işlemi");

  const { data, error } = await supabase.from("todos").delete().match({ id });

  if (error) console.error("Todo silinirken bir hata oluştu,", error);
  return data;
}
