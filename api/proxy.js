const baseURL = 'https://api.clinicanasnuvens.com.br';

const allowedEndpoints = [
  '/executor-agenda/lista',
  '/agenda/profissional',
  '/executor-agenda/disponibilidade',
];

export default async function handler(req, res) {
  const TOKEN = process.env.CLINICA_TOKEN;
  const CID = process.env.CLINICA_CID;

  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Endpoint não informado' });
  }

  if (!endpoint.startsWith('/')) {
    return res.status(400).json({ error: 'Endpoint inválido' });
  }

  const isAllowed = allowedEndpoints.some(e =>
    endpoint.startsWith(e)
  );

  if (!isAllowed) {
    return res.status(403).json({ error: 'Endpoint não permitido' });
  }

  const url = `${baseURL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': TOKEN,
        'clinicaNasNuvens-cid': CID
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Erro no proxy:', error);
    return res.status(500).json({ error: 'Erro na requisição à API da Clínica' });
  }
}