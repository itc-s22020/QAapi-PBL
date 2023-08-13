const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const createCategories = async () => {
    const categories = ['K-pop', 'J-pop', '洋楽', '音楽', '食べ物', '料理', 'ニュース', 'ダンス', 'アイドルグループ', '釣り', '旅行', '勉強']
    await prisma.category.createMany({
        data: categories.map((c) => ({c_name: c}))
    })
}

const createUsers = async () => {
    // 「pass」のハッシュ値
    const pass = '$2b$10$KlX7BDqFLiNcFVdl4DaiYuS3sXbf2V/SIIn5UIOMZ2fugR6KdQOX2'
    await prisma.user.createMany({
        data: [
            {
                user_id: 'yamato1987',
                password: pass,
                name: '山田 大和',
                age: 34,
                mail: 'yamato1987@example.com',
                gender: 0
            },
            {
                user_id: 'sakura_55',
                password: pass,
                name: '佐藤 さくら',
                age: 28,
                mail: 'sakura_55@example.com',
                gender: 1
            },
            {
                user_id: 'takumi88',
                password: pass,
                name: '田中 巧',
                age: 22,
                mail: 'takumi88@example.com',
                gender: 0
            },
            {
                user_id: 'aya_mori',
                password: pass,
                name: '森 彩',
                age: 30,
                mail: 'aya_mori@example.com',
                gender: 1
            },
            {
                user_id: 'koji123',
                password: pass,
                name: '伊藤 浩二',
                age: 45,
                mail: 'koji123@example.com',
                gender: 0
            }
        ]
    })
}

const createQuestions = async () => {
    await prisma.question.createMany({
        data: [
            {
                user_id: 'yamato1987',
                c_id: 11,
                title: 'インド旅行について教えてください！',
                q_text: 'インドに行くのが初めてなので、観光スポットやおすすめの場所、注意すべきことなど、インド旅行に関するアドバイスを教えていただきたいです。'
            },
            {
                user_id: 'sakura_55',
                c_id: 12,
                title: '新しい言語の学習方法について教えてください！',
                q_text: '新しい言語を学びたいと思っています。効果的な学習方法やおすすめのアプリ、注意すべきポイントなどを教えていただけると嬉しいです。'
            },
            {
                user_id: 'takumi88',
                c_id: 12,
                title: '自己啓発書のおすすめを教えてください！',
                q_text: '最近自己啓発に興味を持ち始めました。おすすめの本や著者、具体的な内容などを教えていただけると嬉しいです。'
            }
        ]
    })
}

const createAnswers = async () => {
    await prisma.answer.createMany({
        data: [
            {
                user_id: 'aya_mori',
                q_id: 1,
                a_text: 'タージマハルは必見です！日の出や日没の時間帯に訪れると美しい景色を楽しめます。'
            },
            {
                user_id: 'koji123',
                q_id: 1,
                a_text: 'インドでは水の消費には注意が必要です。ボトル入りの水を飲むか、安全な水処理済みの水を利用しましょう。'
            },
            {
                user_id: 'sakura_55',
                q_id: 1,
                a_text: 'ローカルフードも楽しんでみてください。ただし、食事の安全性には気を付けてください。'
            },
            {
                user_id: 'takumi88',
                q_id: 2,
                a_text: 'デイリープラクティスが大切です。毎日少しずつ学習することで、コンスタントに進歩します。'
            },
            {
                user_id: 'aya_mori',
                q_id: 2,
                a_text: '聞く・話す・読む・書く、全てのスキルをバランスよくトレーニングしましょう。アプリ「Duolingo」は初心者におすすめです。'
            },
            {
                user_id: 'koji123',
                q_id: 2,
                a_text: '言語を実際に使う機会を作ることが上達のカギです。会話パートナーを見つけるか、自分で日記を書いてみるのも良いアイデアです。'
            },
            {
                user_id: 'yamato1987',
                q_id: 3,
                a_text: '「マインドフルネス入門」 by ジョン・カバット・ジン：ストレスの軽減や心の平静を求める方におすすめです。'
            },
            {
                user_id: 'sakura_55',
                q_id: 3,
                a_text: '「7つの習慣」 by スティーブン・コヴィー：効果的な人間関係構築や時間の使い方について学べます。'
            },
            {
                user_id: 'aya_mori',
                q_id: 3,
                a_text: '「思考は現実化する」 by ボブ・プロクター：思考の力を最大限に引き出し、目標達成をサポートします。'
            },
        ]
    })
}

const setBestAnswers = async () => {
    await prisma.question.update({
        where: {
            q_id: 1
        },
        data: {
            best_a_id: 2
        }
    })
    await prisma.question.update({
        where: {
            q_id: 2
        },
        data: {
            best_a_id: 5
        }
    })
}

const main = async () => {
    await createCategories()
    await createUsers()
    await createQuestions()
    await createAnswers()
    await setBestAnswers()
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})