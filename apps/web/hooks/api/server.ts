
app.use(
    cors({
        origin:process.env.WEB_URL,
        credentials:true,
    })
)