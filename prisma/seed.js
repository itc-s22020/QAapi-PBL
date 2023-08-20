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
            },
            {
                user_id: 'admin',
                password: pass,
                name: 'Administrator',
                age: 20,
                mail: 'admin@example.com',
                gender: 0,
                admin: true
            },
            {
                user_id: 'takako_99',
                password: pass,
                name: '高田 優子',
                age: 27,
                mail: 'takako_99@example.com',
                gender: 1
            },
            {
                user_id: 'kotaro_it',
                password: pass,
                name: '伊藤 光太郎',
                age: 32,
                mail: 'kotaro_it@example.com',
                gender: 0
            }
            , {
                user_id: 'misato_nakamura',
                password: pass,
                name: '中村 みさと',
                age: 23,
                mail: 'misato_nakamura@example.com',
                gender: 1
            }
            , {
                user_id: 'ren_sasaki',
                password: pass,
                name: '佐々木 蓮',
                age: 29,
                mail: 'ren_sasaki@example.com',
                gender: 0
            }
            , {
                user_id: 'maiko_taguchi',
                password: pass,
                name: '田口 舞子',
                age: 35,
                mail: 'maiko_taguchi@example.com',
                gender: 1
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
                q_text: 'インドに行くのが初めてなので、観光スポットやおすすめの場所、注意すべきことなど、インド旅行に関するアドバイスを教えていただきたいです。',
                like: 2
            },
            {
                user_id: 'sakura_55',
                c_id: 12,
                title: '新しい言語の学習方法について教えてください！',
                q_text: '新しい言語を学びたいと思っています。効果的な学習方法やおすすめのアプリ、注意すべきポイントなどを教えていただけると嬉しいです。',
                like: 5
            },
            {
                user_id: 'takumi88',
                c_id: 12,
                title: '自己啓発書のおすすめを教えてください！',
                q_text: '最近自己啓発に興味を持ち始めました。おすすめの本や著者、具体的な内容などを教えていただけると嬉しいです。',
                like: 1
            },
            {
                user_id: 'takako_99',
                c_id: 12,
                title: '転職活動中の不安について教えてください！',
                q_text: '転職活動をしている最中で、未知の環境への不安や選択肢の迷いがあります。アドバイスや経験談を聞かせていただけると助かります。',
                like: 4
            },
            {
                user_id: 'maiko_taguchi',
                c_id: 12,
                title: '新しいプログラミング言語の学習方法について教えてください！',
                q_text: '新しいプログラミング言語に挑戦してみたいですが、効果的な学習方法やリソースが分からず困っています。アドバイスをお願いします。',
                like: 10
            },
            {
                user_id: 'aya_mori',
                c_id: 12,
                title: '自己学習のモチベーションを保つ方法を教えてください！',
                q_text: '自己学習をしている最中で、モチベーションの低下や続かないことがあります。どのようにしてモチベーションを維持すれば良いでしょうか？',
                like: 8
            },
            {
                user_id: 'takumi88',
                c_id: 5,
                title: '健康的な食事のコツを教えてください！',
                q_text: '健康的な食事を心がけたいですが、何を食べれば良いか分からず困っています。バランスの取れた食事のコツを教えてください。',
                like: 9
            },
            {
                user_id: 'maiko_taguchi',
                c_id: 11,
                title: '旅行中の持ち物の選び方を教えてください！',
                q_text: '旅行に行く際、何を持っていけば良いか分からずに困っています。持ち物の選び方やポイントを教えていただけると助かります。',
                like: 4
            }
        ]
    })
}

const createAnswers = async () => {
    const q1 = [
        {
            user_id: 'aya_mori',
            q_id: 1,
            a_text: 'タージマハルは必見です！日の出や日没の時間帯に訪れると美しい景色を楽しめます。',
            like: 1
        },
        {
            user_id: 'koji123',
            q_id: 1,
            a_text: 'インドでは水の消費には注意が必要です。ボトル入りの水を飲むか、安全な水処理済みの水を利用しましょう。',
            like: 5
        },
        {
            user_id: 'sakura_55',
            q_id: 1,
            a_text: 'ローカルフードも楽しんでみてください。ただし、食事の安全性には気を付けてください。',
            like: 3
        },
        {
            user_id: 'takako_99',
            q_id: 1,
            a_text: 'インドの観光名所としては、ジャイプルのアンベール城もおすすめです。美しい建物や風景が楽しめます。',
            like: 2
        },
        {
            user_id: 'maiko_taguchi',
            q_id: 1,
            a_text: 'インドの鉄道旅行も魅力的です。風景を楽しみながら地元の人々と交流できる貴重な体験です。'
        },
        {
            user_id: 'takumi88',
            q_id: 1,
            a_text: 'インドのお祭りや文化イベントに参加してみるのも楽しいですよ。地元の人々と触れ合う機会が増えます。',
            like: 2
        }
    ]
    const q2 = [
        {
            user_id: 'takumi88',
            q_id: 2,
            a_text: 'デイリープラクティスが大切です。毎日少しずつ学習することで、コンスタントに進歩します。',
            like: 1
        },
        {
            user_id: 'aya_mori',
            q_id: 2,
            a_text: '聞く・話す・読む・書く、全てのスキルをバランスよくトレーニングしましょう。アプリ「Duolingo」は初心者におすすめです。',
            like: 8
        },
        {
            user_id: 'koji123',
            q_id: 2,
            a_text: '言語を実際に使う機会を作ることが上達のカギです。会話パートナーを見つけるか、自分で日記を書いてみるのも良いアイデアです。',
            like: 3
        }
    ]
    const q3 = [
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
        }
    ]
    const q4 = [
        {
            user_id: 'koji123',
            q_id: 4,
            a_text: '転職は新たな成長のチャンスです。不安も当然ですが、自分のスキルや価値を信じて前向きに進んでみてください。'
        },
        {
            user_id: 'misato_nakamura',
            q_id: 4,
            a_text: '職場の文化や人間関係も重要です。面接時に質問してみることで、自分に合った環境を見つける手助けになるかもしれません。',
            like: 3
        },
        {
            user_id: 'aya_mori',
            q_id: 4,
            a_text: '転職エージェントの利用も検討してみてください。キャリアアドバイザーがサポートしてくれることがあります。',
            like: 5
        },
        {
            user_id: 'takumi88',
            q_id: 4,
            a_text: '転職活動では自信を持つことが大切です。過去の実績を振り返り、自分の強みを意識してアピールしましょう。',
            like: 2
        },
        {
            user_id: 'ren_sasaki',
            q_id: 4,
            a_text: '不安を減少させるために、新しい職場の情報を収集しましょう。社風や業務内容を理解することで安心感が生まれます。',
            like: 6
        },
        {
            user_id: 'sakura_55',
            q_id: 4,
            a_text: '転職仲間との交流も大事です。同じ境遇の人々と話すことで、不安や悩みを共有し、気持ちが軽くなることもあります。',
            like: 6
        }
    ]
    const q5 = [
        {
            user_id: 'takumi88',
            q_id: 5,
            a_text: 'プログラミングは実践が大切です。基本的な構文を理解したら、小さなプロジェクトから始めてみてください。',
            like: 5
        },
        {
            user_id: 'ren_sasaki',
            q_id: 5,
            a_text: 'オンラインチュートリアルやコースを利用するのもおすすめです。CodecademyやCourseraなど、多くのプラットフォームがあります。',
            like: 5
        },
        {
            user_id: 'takako_99',
            q_id: 5,
            a_text: 'プログラミングコミュニティに参加して質問したり、他の人のコードを読んで学ぶことも大切です。',
            like: 4
        },
        {
            user_id: 'koji123',
            q_id: 5,
            a_text: '新しいプログラミング言語を学ぶ際、公式のドキュメントやチュートリアルを活用しましょう。基本的な概念を理解するのに役立ちます。',
            like: 6
        },
        {
            user_id: 'kotaro_it',
            q_id: 5,
            a_text: '実際のプロジェクトで言語を使ってみることもおすすめです。手を動かしてコードを書くことで理解が深まります。',
            like: 6
        },
        {
            user_id: 'yamato1987',
            q_id: 5,
            a_text: 'コードを書いたり、問題を解決する際にエラーが出ても慌てず、エラーメッセージを読み解く練習をすることも大切です。',
            like: 8
        }
    ]
    const q6 = [
        {
            user_id: 'koji123',
            q_id: 6,
            a_text: '目標を具体的に設定することが大切です。小さな成果を実感しやすい目標を立ててみましょう。',
            like: 9
        },
        {
            user_id: 'misato_nakamura',
            q_id: 6,
            a_text: '学習するトピックが自分に興味を引くものであれば、モチベーションも高まりやすいです。興味を持って取り組んでみてください。',
            like: 7
        },
        {
            user_id: 'takumi88',
            q_id: 6,
            a_text: 'ルーティンを作ることも効果的です。毎日決まった時間を学習に割くことで、習慣化しやすくなります。',
            like: 8
        },
        {
            user_id: 'ren_sasaki',
            q_id: 6,
            a_text: '学習の成果を可視化することでモチベーションが上がることがあります。プロジェクトを完成させることで達成感を味わいましょう。',
            like: 4
        },
        {
            user_id: 'yamato1987',
            q_id: 6,
            a_text: '継続的な学習をサポートするために、学習仲間と共に進捗を共有することも一つの方法です。お互いに励まし合いましょう。',
            like: 5
        },
        {
            user_id: 'sakura_55',
            q_id: 6,
            a_text: 'モチベーションが下がった時には、一時的な休憩を取ることも大切です。無理せず、リフレッシュしてから再び取り組んでみましょう。',
            like: 6
        }
    ]
    const q7 = [
        {
            user_id: 'ren_sasaki',
            q_id: 7,
            a_text: '野菜や果物を多く摂ることが大切です。色とりどりの食材を取り入れることで、栄養バランスが整います。',
            like: 5
        },
        {
            user_id: 'aya_mori',
            q_id: 7,
            a_text: 'タンパク質源も忘れずに摂るようにしましょう。鶏肉や豆類、魚などが良い選択肢です。',
            like: 7
        },
        {
            user_id: 'yamato1987',
            q_id: 7,
            a_text: '処理食品や加工食品はできるだけ避け、自炊を心がけることで栄養素の摂取をコントロールしやすくなります。',
            like: 3
        }
    ]
    const q8 = [
        {
            user_id: 'yamato1987',
            q_id: 8,
            a_text: '旅行先の気候やアクティビティに合わせて服を選びましょう。必要最低限の服を持っていくことで荷物を軽く保ちます。',
            like: 4
        },
        {
            user_id: 'sakura_55',
            q_id: 8,
            a_text: '薬やトラベルアダプター、必要な書類など、忘れがちなアイテムもチェックリストに入れておくと安心です。',
            like: 10
        },
        {
            user_id: 'kotaro_it',
            q_id: 8,
            a_text: '複数のバッグや荷物は避け、コンパクトにまとめることで移動が楽になります。',
            like: 7
        }
    ]
    await prisma.answer.createMany({
        data: [
            ...q1,
            ...q2,
            ...q3,
            ...q4,
            ...q5,
            ...q6,
            ...q7,
            ...q8
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