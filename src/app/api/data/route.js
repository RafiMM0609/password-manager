import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
    try {
        const { key, value, note } = await request.json();
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        const trimmedNote = note.trim();
        const { data, error } = await supabase.from("data").insert([
            { 
                data_key: trimmedKey, 
                data_value: trimmedValue, 
                data_note: trimmedNote,
                created_at: new Date().toISOString()
            }
        ]);

        if (error) {
            throw error;
        }

        return new Response(JSON.stringify({ message: 'Data added successfully' }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to add data', details: error.message }), { status: 400 });
    }
    
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const { data, error } = await supabase
            .from("data")
            .select("*")
            .eq("id", id || null)
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data', details: error.message }), { status: 400 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const trimmedId = id.trim();
        const { error } = await supabase
            .from("data")
            .delete()
            .eq("id", trimmedId);

        if (error) {
            throw error;
        }

        return new Response(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete data', details: error.message }), { status: 400 });
    }
}