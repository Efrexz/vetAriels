import PlusIcon from '@assets/plusIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import ClipIcon from '@assets/clipIcon.svg?react';
import FileContract from '@assets/fileContract.svg?react';




function ClinicalRecords() {

    const consultationData = {
        date: '15-09-2024 05:57 PM',
        reason: 'Consulta',
        clinicalExam: ['Mucosas rosadas', 'Alerta', 'glasgow 5', 'Parafimosis'],
        physiologicalConstants: [
            { icon: '⚖️', value: '9.8 Kg' },
            { icon: '🌡️', value: '38 ºC' },
            { icon: 'DHT', value: '5%' },
            { icon: 'TRC', value: '2"' }
        ],
        diagnosis: 'parafimosis - Presuntivo',
        treatment: [
            'DEXAMETASONA - 0.2 MG/KG....1 ML SC',
            'RANITIDINA - 2MG/KG....0.98 ML SC',
            'TRAMADOL - 2MG/KG....0.39 ML SC',
            'DIPIRONA - 10 MG/KG....0.20 ML SC'
        ],
        observations: 'Se recomienda 3 días de tto, el día de mañana poner solo la mitad de la dosis de dexa.'
    };

    const filterType = [
        { value: "consulta", label: "Consulta" },
        { value: "Control", label: "Control" },
        { value: "cirugía", label: "Cirugía" },
        { value: "vacunación", label: "Vacunación" },
        { value: "antipulga", label: "Antipulga" },
        { value: "antiParasitario", label: "Antiparasitario" },
        { value: "nota", label: "Nota" },
        { value: "internamiento", label: "Internamiento" },
        { value: "triaje", label: "Triaje" },
        { value: "orden-de-examenes", label: "Orden de examenes" },
    ]

    return (
        <section className="w-full mx-auto bg-white p-6 shadow-md rounded-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 border-b-2 border-gray-200 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                    <button
                        className="border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center gap-2 w-full"
                    // onClick={() => navigate("/pets/create/no_client")}
                    >
                        <PlusIcon className="w-5 h-5" />
                        NUEVO REGISTRO
                    </button>
                    <button
                        className="border border-gray-300 text-black bg-gray-50 py-2 px-4 rounded hover:bg-gray-100 flex items-center justify-center gap-2 w-full"
                    // onClick={() => navigate("/pets/create/no_client")}
                    >
                        <ClipIcon className="w-5 h-5" />
                        ADJUNTAR ARCHIVO
                    </button>
                    <button
                        className="border border-gray-300 text-black bg-gray-50 py-2 px-4 rounded hover:bg-gray-100 flex items-center justify-center gap-2 w-full"
                    // onClick={() => navigate("/pets/create/no_client")}
                    >
                        <FileContract className="w-5 h-5" />
                        NOTA
                    </button>
                </div>

                <div className="w-full lg:w-auto">
                    <select
                        name="type"
                        className="w-full lg:w-[250px] rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2 hover:border-blue-300 focus-within:border-blue-300"
                    >
                        <option value="filterType">Filtrar por tipo</option>
                        {filterType.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex mb-2 gap-2">
                <Stethoscope className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-medium text-red-500 pb-4 flex flex-col">
                    Clientes
                    <span className="text-sm text-gray-500">{consultationData.date}</span>
                </h2>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-600">Motivo de consulta:</h3>
                <p className="text-gray-700">{consultationData.reason}</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-600">Examen clínico:</h3>
                <ul className="list-disc pl-6 text-gray-700">
                    {consultationData.clinicalExam.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-600">Constantes fisiológicas:</h3>
                <div className="flex gap-4">
                    {consultationData.physiologicalConstants.map((constant, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                            <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                                {constant.icon}
                            </div>
                            <div className="text-gray-700">
                                <p>{constant.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-600">Diagnóstico:</h3>
                <p className="text-gray-700">{consultationData.diagnosis}</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-600">Tratamiento:</h3>
                <ul className="list-disc pl-6 text-gray-700">
                    {consultationData.treatment.map((medication, index) => (
                        <li key={index}>{medication}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-600">Observaciones:</h3>
                <p className="text-gray-700">{consultationData.observations}</p>
            </div>
        </section>
    );
}

export { ClinicalRecords };