import withProtect from "../../../middleware/withProtect"


export async function handler(req, res) {
    res.send(req.user)
}

export default withProtect(handler)