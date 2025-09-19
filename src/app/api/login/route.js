import { supabase } from "@/lib/supabaseClient";
import jwt from "jsonwebtoken";;

export async function POST(request) {
    try {
        const {nama, sandi} = await request.json();
        if (sandi != 'rafijago'){
            return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
        }
        if (!supabase) {
            return new Response(JSON.stringify({ error: 'Database configuration error' }), { status: 500 });
        }
        const {data, error} = await supabase.from('users').select('*').eq('email', nama).single();
        if (error) {
            return new Response(JSON.stringify({ error: 'User not found', details: error.message }), { status: 400});
        }

        const token = jwt.sign(
            {id: data.id, email: data.email},
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );
        return new Response(JSON.stringify(
            { success: true, user: data, token: token }
            ), 
        { status: 200 }
    );
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500 });
    }
}