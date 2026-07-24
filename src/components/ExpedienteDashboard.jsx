import { createSignal, createResource, Show } from 'solid-js';

// Servicio que conecta con la ruta GET real de tu FastAPI en Staging
const fetchExpediente = async (id) => {
    if (!id) return null;

    // ✅ Dominio unificado corregido
    const response = await fetch(`https://desarrollo-johankepler.portalweb.cc/api/v1/estudiantes/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('No se encontró el expediente del estudiante en el registro académico.');
        }
        throw new Error('Error al conectar con la base de datos o bloqueo de seguridad.');
    }

    return response.json();
};

export default function ExpedienteDashboard() {
    const [alumnoId, setAlumnoId] = createSignal('');
    const [searchId, setSearchId] = createSignal(null);

    // Resource asíncrono nativo de Solid.js
    const [expediente] = createResource(searchId, fetchExpediente);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = alumnoId().trim();
        if (trimmed !== '') {
            setSearchId(trimmed);
        }
    };

    return (
        <div class="space-y-8">
            {/* Buscador de Expedientes con Estilo Institucional */}
            <form onSubmit={handleSearch} class="bg-white p-6 rounded-lg border-b-4 border-kepler-gold shadow-md max-w-xl mx-auto flex gap-4">
                <div class="flex-1">
                    <label class="block text-xs font-black uppercase text-slate-500 mb-2 tracking-wider">ID o NIE del Estudiante</label>
                    <input
                        type="number"
                        value={alumnoId()}
                        onInput={(e) => setAlumnoId(e.target.value)}
                        placeholder="Ej. 1"
                        class="w-full bg-slate-100 border-2 border-slate-200 rounded px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-kepler-red transition-colors"
                    />
                </div>
                <button type="submit" class="bg-kepler-red hover:bg-red-800 text-white font-black uppercase text-xs px-6 rounded transition-colors self-end h-12 border-b-4 border-black/20">
                    Consultar
                </button>
            </form>

            {/* Controladores de Estado (Loading / Error) */}
            <Show when={expediente.loading}>
                <div class="text-center py-12">
                    <div class="animate-spin inline-block w-8 h-8 border-4 border-kepler-red border-t-transparent rounded-full mb-4"></div>
                    <p class="text-xs font-black uppercase text-slate-500 tracking-widest">Accediendo al registro escolar...</p>
                </div>
            </Show>

            <Show when={expediente.error}>
                <div class="bg-red-50 border-l-8 border-kepler-red p-6 rounded max-w-2xl mx-auto text-left">
                    <h4 class="text-kepler-red font-black uppercase text-sm mb-1">❌ Error de Consulta</h4>
                    <p class="text-sm font-medium text-slate-700">{expediente.error.message}</p>
                </div>
            </Show>

            {/* Renderizado de Datos del Expediente mediante callback para mayor seguridad reactiva */}
            <Show when={expediente()}>
                {(item) => (
                    <div class="bg-white rounded-lg border-l-8 border-kepler-red shadow-xl max-w-3xl mx-auto overflow-hidden text-left">

                        {/* Encabezado de la Tarjeta de Registro */}
                        <div class="bg-black text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-kepler-gold">
                            <div>
                                <span class="text-xs font-black text-kepler-gold uppercase tracking-widest block mb-1">Expediente Académico Oficial</span>
                                <h2 class="text-3xl font-black uppercase tracking-tighter leading-none">
                                    {item().apellido}, {item().nombre}
                                </h2>
                            </div>
                            <div class="bg-kepler-red px-4 py-2 rounded text-xs font-black uppercase tracking-wider">
                                NIE: {item().nie}
                            </div>
                        </div>

                        {/* Bloques de Datos Técnicos que mapean tu EstudianteSchema */}
                        <div class="p-8 grid md:grid-cols-2 gap-8 font-medium text-slate-700">
                            <div class="space-y-4">
                                <div>
                                    <span class="block text-xs font-black uppercase text-slate-400">Identificador de Grado</span>
                                    <span class="text-lg font-bold text-black">Código de Grado: {item().id_grado}</span>
                                </div>
                                <div>
                                    <span class="block text-xs font-black uppercase text-slate-400">Género registrado</span>
                                    <span class="text-base text-slate-900 font-bold">
                                        {item().genero === 'M' ? 'Masculino' : 'Femenino'}
                                    </span>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <span class="block text-xs font-black uppercase text-slate-400">Fecha de Nacimiento</span>
                                    <span class="text-base text-slate-900 font-bold">{item().fecha_nacimiento}</span>
                                </div>
                                <div>
                                    <span class="block text-xs font-black uppercase text-slate-400">Condición de Matrícula</span>
                                    <span class={`inline-block mt-1 px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${item().estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                                        ● {item().estado}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </Show>
        </div>
    );
}