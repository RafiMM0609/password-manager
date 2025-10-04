import { supabase } from "@/lib/supabaseClient";
import jwt from 'jsonwebtoken';

export async function GET(request) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return new Response(JSON.stringify({ error: 'Token expired' }), { status: 401 });
        } else if (error.name === 'JsonWebTokenError') {
            return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
        } else {
            return new Response(JSON.stringify({ error: 'Token verification failed' }), { status: 401 });
        }
    }

    const { searchParams } = new URL(request.url);
    const src = searchParams.get('src');

    let query = supabase.from("data").select("data_key, id");
    if (src) {
        query = query.ilike('data_key', `%${src}%`);
    }
    query = query.eq('userid', decoded.id).order('created_at', { ascending: false });
    const { data, error } = await query;

    if (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify({"data": data}), { status: 200 });
}