const { OPENAI_API_KEY } = require("../config")

exports.gpt = async (content) => {
    if(!OPENAI_API_KEY) {
        throw new Error(
            "é necessario configurar a variavel de ambiente OPENAI_API_KEY com o seu token OpenAI"
        );
    }

    const {data} = await axios.post('http://api.openai.com/v1/chat/completions',
        {
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content}],
        },
        {
            header: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
        }
    );

    return data.choices[0].message.content;
}