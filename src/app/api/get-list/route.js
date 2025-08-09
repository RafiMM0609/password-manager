import { supabase } from "@/lib/supabaseClient";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const src = searchParams.get('src');

    let query = supabase.from("data").select("data_key, id");
    if (src) {
        query = query.ilike('data_key', `%${src}%`);
    }
    const { data, error } = await query;

    if (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify({"data": data}), { status: 200 });
}