const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * 質問か回答に対していいねしたり解除したりする。
 * @param target_type 質問の場合は0、回答の場合は1。
 * @param like いいねする場合はtrue、そうでない場合はfalse。
 */
const SetLiked = (target_type, like) => async (req, res) => {
    const [typeStr, typeModel, idColumn] = target_type === 0 ? ['質問', 'question', 'q_id'] : ['回答', 'answer', 'a_id']
    const id = parseInt(req.body.id)
    if (!id) {
        res.status(400).json({message: `${typeStr}IDが必要です`})
        return
    }
    await prisma[typeModel].findUnique({
        where: {
            [idColumn]: id
        }
    }).then(async (post) => {
        if (!post) return res.status(404).json({message: `${typeStr}が見つかりませんでした。`})
        const likeData = {
            target_type: target_type,
            user_id: req.user,
            target_id: id
        }
        await prisma.like.findUnique({
            where: {like_identifier: likeData}
        }).then(async (r) => {
            if (like) {
                // いいねする場合の処理
                if (r) {
                    res.status(400).json({message: `この${typeStr}はいいね済みです。`})
                    return
                }
                const increaseLikeCount = prisma[typeModel].update({
                    where: {[idColumn]: id},
                    data: {like: post.like + 1}
                })
                const createLikeData = prisma.like.create({data: likeData})
                await prisma.$transaction([increaseLikeCount, createLikeData])
                    .then(() => res.status(200).json({message: `${typeStr}にいいねしました。`}))
            } else {
                // いいねを解除する場合の処理
                if (!r) {
                    res.status(400).json({message: `この${typeStr}はいいねしていません。`})
                    return
                }
                const decreaseLikeCount = prisma[typeModel].update({
                    where: {[idColumn]: id},
                    data: {like: post.like - 1}
                })
                const deleteLikeData = prisma.like.delete({where: {like_identifier: likeData}})
                await prisma.$transaction([decreaseLikeCount, deleteLikeData])
                    .then(() => res.status(200).json({message: `${typeStr}へのいいねを解除しました。`}))
            }
        })
    })
}

module.exports = SetLiked