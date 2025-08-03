import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
    try {
        const {nama, sandi} = await request.json();
        if (!supabase) {
            return new Response(JSON.stringify({ error: 'Database configuration error' }), { status: 500 });
        }
        const {data, error} = await supabase.from('users').select('*').eq('email', nama).single();
        if (error) {
            return new Response(JSON.stringify({ error: 'User not found', details: error.message }), { status: 400});
        }
        return new Response(JSON.stringify({ success: true, user: data }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500 });
    }
}