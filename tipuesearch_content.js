var tipuesearch = {"pages":[{"title":"About This Site","text":"ご訪問ありがとうございます。本サイトは Coleyon の技術ブログです。 Python, Linux, Docker, *aaS を扱う機会が多いので、関連した内容が主ではありますが、 技術は変わりゆくので、あまりジャンルにはこだわらず、 時々のキャッチアップに応じて、他の方や自身の入門や調べ物が楽になるような情報を掲載したいと思います。 Github","tags":"pages","url":"https://coleyon.github.io/pages/about-this-site.html","loc":"https://coleyon.github.io/pages/about-this-site.html"},{"title":"Policies","text":"広告の表示とプライバシー 当サイトは、 Google AdSense を使用した広告の表示を行っております。 Google などの第三者配信事業者が Cookie を使用して、ユーザーがそのウェブサイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信します。 Google が広告 Cookie を使用することにより、ユーザーがそのサイトや他のサイトにアクセスした際の情報に基づいて、Google やそのパートナーが適切な広告をユーザーに表示できます。 ユーザーは、 広告設定 よりパーソナライズ広告を無効にできます。または、 www.aboutads.info へアクセスすれば、パーソナライズ広告に使われる第三者配信事業者の Cookie を無効にできます。 第三者配信事業者や広告ネットワークの配信する広告が、当サイトに掲載されます。 クッキーを使用することで、当サイトはユーザーのコンピュータを識別できるようになりますが、ユーザー個人を特定するものではありません。 トラフィックデータの収集とプライバシー 当サイトは、 Google Analytics を使用したアクセス解析を行っております。 Google Analytics は、トラフィックデータの収集のために Cookie を使用しております。 トラフィックデータは匿名で収集されており、ユーザー個人を特定するものではありません。 免責事項 当サイトで掲載している画像の著作権・肖像権等は各権利所有者に帰属致します。 当サイトは他者の権利を侵害する目的・意思はございませんが、万が一権利を侵害すると思われる内容がございましたら、 各権利所有者様が直接メールでご連絡下さい。確認後、侵害の事実がある場合は関連法規に則って対応致します。 当サイトのリンクやその他表示によって他のサイトに移動された場合、 移動先サイトで提供される情報、サービス等について一切の責任を負いません。 当サイトのコンテンツ・情報につきましては正確な情報を掲載するよう努めておりますが、 誤情報が入り込んだり、情報が古くなっていることもございます。 当サイトに掲載された内容を使用した結果生じた損害等につきまして、 一切の責任を負いかねますのでご了承ください。 連絡先 以上の内容に関してのご連絡・お問い合わせは こちらのフォーム よりお願いいたします。","tags":"pages","url":"https://coleyon.github.io/pages/policies.html","loc":"https://coleyon.github.io/pages/policies.html"},{"title":"Discord の Bot に定時実行をさせてみよう","text":"Discord の Bot に Cron のような定時処理をさせる方法を紹介します。 Python と discord.py を使用します。 要点 discord.py を使って python で開発する。 discord.ext.tasks でバックグラウンドループを実現する。 Code croniter で各ループ（タイミング）におけるジョブの発火要否判定を実現する。 Code Command.invoke() で Bot による Bot コマンドの実行を実現する。 Code やってみた discord.py を使って、オンラインゲームのクエストや対戦マッチング相手を募集する時に使える Bot を作り、1 か月ほど実際に使ってみましたので、記事にしてみます。 概略仕様 コード一式 論よりコードの方はこちら。 https://github.com/coleyon/discord-partypoll 機能 ざっくり言えば、以下 2 つの機能から成る Bot です。 PartyPoll - SimplePoll に似た、イベントの周知と参加者募集ができる機能。 Cron - PartyPoll のコマンドを Bot 自身に、 cron ライクな設定書式でスケジューリング・定時実行させる機能 環境 Python プログラムとしての Bot が、Docker コンテナ上で実行される構成です。 環境構築 サーバと OS を用意する 例えば EC2 上に、 Ubuntu 18.04 LTS x86-64 を立てます。無料利用枠内で十分です。 Docker サーバ環境をインストールする docker と compose をインストールします。 https://docs.docker.com/engine/install/ubuntu/ https://docs.docker.com/compose/install/ Docker サーバ環境をインストールする こんな風になったと思います。 $ docker --version Docker version 19 .03.12, build 48a66213fe $ docker-compose --version docker-compose version 1 .27.2, build 18f557f9 $ id uid = 1000 ( ubuntu ) gid = 1000 ( ubuntu ) , # 中略 ... ,999 ( docker ) $ Docker コンテナをビルドする $ git clone https://github.com/coleyon/discord-partypoll.git Cloning into 'discord-partypoll' ... ... Resolving deltas: 100 % ( 136 /136 ) , done . $ cd discord-partypoll/ $ docker-compose build $ docker images | grep partypoll discord-partypoll_discord-bot latest ... $ Bot を Discord サーバに誘う Discord アプリを作る Developer Portal 上でアプリケーションを作成します。 Bot の OAuth2 Token を Bot プログラムにセットする アプリの General Information メニューから Client Secret を得て、 docker-compose.yml の DISCORD_BOT_TOKEN にセットします。 version : \"3\" services : discord-bot : restart : always build : . environment : DISCORD_BOT_TOKEN : \"yourtoken\" Bot を Discord サーバに誘う アプリの OAuth2 メニューから Scopes が BOT となる OAuth2 URL を得ます Permissions は Send Messages , Manage Messages , Attach Files , Mention Everyone , Add Reactions を与えてください。 Bot を Discord サーバに誘う OAuth2 URL にブラウザでアクセスし、Bot を Discord サーバに招きます。 Bot プログラムを起動する Bot プログラムの依存ライブラリを生成する Pipfile から requirements.yml を生成します。 $ pipenv lock -r > requirements.txt Bot プログラムを起動する Bot プログラム（の実行環境としての Docker コンテナ）を起動します。 $ docker-compose up -d $ docker-compose logs -f Attaching to discord-partypoll_discord-bot_1 discord-bot_1 | -Logged in info- discord-bot_1 | { BOT_NAME } discord-bot_1 | { BOT_ID } discord-bot_1 | { DISCORDPY_VERSION } discord-bot_1 | discord-bot_1 | Poll Extension Enabled. discord-bot_1 | Cron Extension Enabled. &#94;CERROR: Aborting. $ Bot プログラムを起動すると、Discord 上の Bot がオンラインとなり、使用可能な状態になります。 パーティ募集コマンド ppoll を使ってみる 募集全体の人数制限が可能な募集 チーム全体で計 20 名までを上限とするパーティの募集をするコマンドです。 /ppoll total 全 20 名 3 チーム 20 TeamA TeamB TeamC 個々の募集項目毎に人数制限が可能な募集 個々のチームで計 4 名までを上限とするパーティの募集をするコマンドです。 /ppoll each 各 4 名 3 チーム [4]TeamA [4]TeamB [4]TeamC ヘルプコマンド 詳しくは /ppoll help コマンドの説明か、Git リポジトリの readme.md をご覧ください。 定時実行コマンド cron を使ってみる 実行タイムゾーン指定 実行 Timezone を設定できます。デフォルトは日本時間 (Asia/Tokyo) ですが、米国東部時間 (EST) などに設定することもできます。 ジョブの定義と有効化 Job を定義します。 /cron add \"Job A\" */1 * * * mon-fri /ppoll each 各 4 名 3 チームパーティ ({{1.days}} 開催 !) [4]TeamA [4]TeamB [4]TeamC cron を稼働状態にします (2020/10/30 23:11 に実行したとします ) /cron enable ジョブの稼働例 こうなります。詳しくは /cron help コマンドの説明か、Git リポジトリの readme.md をご覧ください。 参考資料 基本的に 公式 Docs がバイブルですが、作っている途中でオンラインゲームのメンバーさんより、以下の本をご紹介頂きました。 読んだところとても分かりやすく公式マニュアルでは把握できなかった内容が多々あったりして有用でしたので、Discord の Bot 作りに興味がある方にはオススメです。 Python で作る Discord Bot 開発実践入門 https://techbookfest.org/product/5755158612934656?productVariantID=5633838124367872","tags":"programming","url":"https://coleyon.github.io/discord, bot, programming.html","loc":"https://coleyon.github.io/discord, bot, programming.html"},{"title":"GCP KMS を使って秘密情報を対称暗号化・復号化する","text":"概要 KMS を利用して、認証情報などの秘密を暗号化・復号化する方法を紹介します サンプルコードと環境 サンプルコード : この記事は、連載の 1 つ前の記事で作成した バッチスクリプトのコード を例にした続きの内容です。 コードを動かしたい人は、この記事よりも readme.md 見てもらうと早いです。 （前記事）対策前のコード : https://github.com/coleyon/gcalapi-caldav-sample/tree/master （今記事）対策後のコード : https://github.com/coleyon/gcalapi-caldav-sample/tree/kms-enc-dec ( Diff ) 対策前のコードでは Calendar API を叩くために GCP サービスアカウントの鍵 credential.json ファイルを認証情報として利用しますが、暗号化せずコードに同梱しています。 対策後のコードでは、KMS を利用して鍵 credential.json の内容を暗号化し、かつ暗号化した鍵をコードに含めない（Cloud Functions 実行時に環境変数で与える）ことでセキュリティを向上しています。 環境 : 灰色アローは手作業、青アローはプログラム処理です。 生 JSON 鍵を得て KMS で対称暗号化し、バイナリ暗号鍵を得る バイナリ暗号鍵を ASCII 化し、Cloud Functions の環境変数にセットする コードは git、暗号鍵は環境変数をソースとして、Cloud Functions 上にデプロイする Cloud Functions 上のスクリプトは、暗号鍵を KMS API で復号化する GKE KeyRing を作る 暗号鍵メニューから、キーリングを適当な名前で作ります。今回は、今後も増えるだろうサービスアカウントのクレデンシャルをたくさんぶら下げるためのキーリング名にしました。 GKE Key を作る キーリングにぶら下げるキーを作ります。Calendar API アクセス用サービスアカウントの JSON 形式のクレデンシャルである事を端的に示すキー名で作りました。目的は 対称暗号化 / 復号化 です。 サービスアカウントは強い権限（プロジェクトの管理者）を持たせる事が多いと思いますが、ローテーションを自動でかけて同じ暗号を使い続けないように設定する事もできます。 秘密を暗号化する 作業に先立って、生クレデンシャル JSON ファイルは、非公開の Storage private-bucket を介してアップロードします。 暗号化は CloudShell で作業をします。サービスアカウントの JSON 形式生クレデンシャル credentials.json を暗号化して、バイナリファイル credentials.json.enc を得ます。 $ gsutil cp gs://private-bucket/credentials.json ./ $ gcloud kms encrypt \\ --plaintext-file = ./credentials.json \\ --ciphertext-file = credentials.json.enc \\ --location = global \\ --keyring = service-account-credentials \\ --key = gcal-api-json-cred \\ && rm ./credentials.json 暗号化文字列を得る アプリケーションで取り扱いやすい様に Python で credentials.json.enc を文字列に変換します。 $ python >>> import base64, io >>> with io.open ( 'credentials.json.enc' , 'rb' ) as f: >>> base64.b64encode ( f.read ()) .decode ( 'ascii' ) QOsAErqw....bI = # 暗号化されたクレデンシャル文字列 [ 1 ] + Stopped python $ exit logout There are stopped jobs. $ 秘密を復号化する 次のようなコードでもって、復号化して使います。 import json from base64 import b64decode from google.oauth2 import service_account from googleapiclient.discovery import build def decrypt_credectial (): kms_client = build ( 'cloudkms' , 'v1' ) key_path = 'projects/ {pj} /locations/ {loc} /keyRings/ {key_ring} /cryptoKeys/ {key} ' . format ( pj = 'Google のプロジェクト ID' , loc = 'KMS キーリングのロケーション。本例だと global' , key_ring = 'KMS キーリング名 ' , key = 'KMS キー名 ' ) crypto_keys = kms_client . projects () . locations () . keyRings () . cryptoKeys () kms_request = crypto_keys . decrypt ( name = key_path , body = { 'ciphertext' : ' 暗号化クレデンシャル ' }) kms_response = kms_request . execute () return json . loads ( b64decode ( kms_response [ 'plaintext' ] . encode ( 'ascii' ))) creds = service_account . Credentials . from_service_account_info ( decrypt_credectial (), scopes = [ 'https://www.googleapis.com/auth/calendar.events.readonly' , 'https://www.googleapis.com/auth/calendar.readonly' ] ) . with_subject ( 'username@gsuite-domain' ) 前記事のコードと比べて このような違い があります。生クレデンシャルを文字列やファイルとしてソースコードに含める必要が無くなって、安心感が出ました。","tags":"howto","url":"https://coleyon.github.io/googleapis, python, programming.html","loc":"https://coleyon.github.io/googleapis, python, programming.html"},{"title":"GCP で Google Calendar を CalDAV サーバに複製する","text":"Python バッチスクリプトで Google Calendar からスケジュール情報を採取し、CalDAV サーバへ複製する例を紹介します。 概要 GSuite 上の任意のユーザの Calendar に、Google Calendar API を介してアクセスする GCP の Cloud Functions にデプロイした Python バッチスクリプトを、Cloud Scheduler + Pub/Sub で定時実行する API アクセス認証を GCP の サービスアカウント キーで行い、個々のカレンダーオーナーからのアクセス許可は不要とする サンプルコード https://github.com/coleyon/gcalapi-caldav-sample 構成 グレーは環境設定、ブルーはバッチ処理です。 1. GSuite で API アクセスを許可する アクセス対象としたいカレンダーが存在する GSuite 環境に対して、外部からの API アクセスを受付可能に設定をします。公式ドキュメントの、 管理コンソールで API アクセスを有効にする 手順になります。 API リファレンスを有効にする API アクセスを有効にする 2. GCP にサービスアカウントを作成しキーを得る 今回は サービスアカウントキー を用いた認証ストラテジで Calendar API を利用します。なお、サービスアカウントではなくパーソナルなアカウントの認証ストラテジで API を利用する方式もありますが、当記事では対象外です。認証ストラテジの選択肢と差の解説は、 こちらの公式ドキュメント が分かりよいと思います。 IAM と管理 > サービスアカウント でサービスアカウントを作成します。 サービスアカウントの鍵を生成し、JSON 形式で取得します。鍵は、バッチスクリプトが API アクセス認証時に使います。 サービスアカウントのクライアント ID を確認します。クライアント ID は、バッチスクリプトの認証情報および、GSuite の API クライアントアクセス許可対象として使います。 3. GSuite で API クライアントアクセスを許可する GSuite で、どのリソースに対する API アクセス操作を、誰に許可するかを設定します。設定手順は、 OAuth: API クライアント アクセスの管理 になります。 設定内容は、 クライアント名 には先に GCP 上で作成したサービスアカウントの クライアント ID を指定し、 スコープ には https://www.googleapis.com/auth/calendar.readonly , https://www.googleapis.com/auth/calendar.events.readonly を指定して承認します。 余談ですが、指定可能なスコープと API の仕様は API リファレンス に書かれています。 4. CalDAV サーバを立てる 当サンプルでは、CalDAV サーバである Radicale に、Google Calendar から採取した情報を吐き出して、ユーザに利用させます。試験版の Radicale は docker コンテナ で立てるのが手っ取り早いです。 起動するとこんな感じです。サーバの URL がアプリに与える環境変数の CALDAV_SERVER_URL 、 ログイン情報が CALDAV_SERVER_USER , CALDAV_SERVER_PASS です。 ログインすると、即カレンダーの作成画面になりますので、こんな感じで作ります。Title がカレンダー名であり、アプリに与える環境変数の CALDAV_SERVER_CALENDAR_NAME です。 作成したカレンダーの URL は、 http://${HOSTNAME}:5232/${USERNAME}/${CALENDAR_ID}/ になり、環境変数 CALDAV_SERVER_URL に相当します。 余談 CalDAV サーバは、例えば Thunderbird のカレンダー拡張（Lightning）のようなクライアントから参照・同期できる、ネットワークカレンダーサーバの規格です。 RFC 4791 で仕様が定義されており、いわゆる iCAL 形式 ( RFC 2445 ) でデータ交換をします。 そもそもカレンダーというモノは、割と面倒くさい概念（タイムゾーン、Free/Busy、参加者と参加不参加、繰り返しタスクなど）がありますので、車輪があるなら再発明しないで利用するのがお得です。 5. GCP 上にバッチ処理を設置する Pub/Sub の作成 トピックを作成し、トピックの名前を確認しておきます。 作成したトピックに対する、Pull タイプのサブスクリプションを作成します。サブスクライバとなる CloudFunction 宛のメッセージングを定義する事に相当します。 Cloud Schedule の登録 先ほど作成した Pub/Sub トピックをターゲットとするスケジュールを作成します。スケジュールが、Pub/Sub に対するパブリッシャとなる事に相当します。 作成したら、試しにジョブを実行して Publish メッセージングが成功する事を確認しておきます。 Python スクリプトのデプロイ準備をする Cloud Storage に、非公開バケット function-codes を 1 つ作ります。 次に、 スクリプト の credentials.json を、先の手順で取得したサービスアカウントの JSON 形式の鍵に差し替えて、 Pipfile , Pipfile.lock , main.py および、差し替え後の credential.json を 1 つの Zip ファイル gcalendar-fetcher.zip に圧縮し、先に作成した Cloud Storage のバケットにアップロードします。 Python スクリプトを Functions にデプロイする バケット内の Zip ファイル gcalendar-fetcher.zip をソースとする関数を定義します。トリガーには、Pub/Sub に作成したトピック test-getting-gcal-events トピックを指定します。実行する関数には main 関数 を指定します。 また、環境変数は こちらに定義した変数 を与えます。 6. 実行して結果を確認してみる Cloud Scheduler に作成したタスクが実行済の場合は結果欄に「成功」が出ていると思います。まだスケジュールが走っていない場合は、実行ボタンを押下し発火させた結果を同様に確認します。 また、Function にデプロイしたスクリプトが、Pub/Sub メッセージングを介して実行されていることも確認します。 いずれも成功なら、CalDAV サーバに登録されたはずのカレンダー情報を閲覧してみます。radicale から ical をダウンロードして中身を確認してみましょう。ical フォーマットのデータが得られます。 BEGIN : VCALENDAR VERSION : 2.0 PRODID :- // PYVOBJECT // NONSGML Version 1 // EN X - WR - CALDESC ; VALUE = TEXT :test X - WR - CALNAME ; VALUE = TEXT :test BEGIN : VEVENT UID :xxxxxxxxxxxxxxxxxxx@google . com DTSTART : 20190913 T013000Z DTEND : 20190913 T084500Z DTSTAMP : 20190726 T050838Z LAST - MODIFIED : 20190726 T050856Z STATUS : CONFIRMED SUMMARY : 展示会にいく TRANSP : OPAQUE URL : https : // www . google . com / calendar / event?eid = XXXXXXXXXXXXXXXXXXXXXXXX END : VEVENT BEGIN : VEVENT UID :yyyyyyyyyyyyyyyyyyyyyyyyyy@google . com DTSTART : 20191004 T040000Z ... END : VEVENT END : VCALENDAR Thunderbird の Lightning 拡張でネットワークカレンダーとして見る方法もあります。 環境変数 CALDAV_SERVER_URL に与えた URL が、ネットワークカレンダーの場所に相当します。 よく採れてます、使えそうですね。","tags":"programming","url":"https://coleyon.github.io/google, python, programming.html","loc":"https://coleyon.github.io/google, python, programming.html"},{"title":"screen コマンドを使った linux terminal セッション共有","text":"Screen コマンドを使うと、Linux コンソールを複数ユーザセッション間で共有できます。 参考 みやすい概要 https://mistymagich.wordpress.com/2011/11/08/multiuser_screen_command multiuser mode 権限制御系操作 http://aperiodic.net/screen/multiuser ユースケース Dev チームのペアプログラミングよろしく、Ops チームにも部下育成やダブルチェックを兼ねて、Linux サーバオペレーションを複数名で行う場合があります。そんな時は、物理コンソールに人が集まって行うのもよいですが、ターミナルのセッションを SSH で皆が共有できる Screen を使うと捗ります。 環境例 Debian Jessie + 共有元ユーザ : parent 共有先ユーザ : child 事前準備 screen インストール sudoer@test:~$ sudo apt-get update && sudo apt-get install screen screen セッションを各ユーザで共有可能にする設定 ## sudoer console sudoer@test:~$ sudo chmod u+s /usr/bin/screen sudoer@test:~$ sudo chmod 755 /var/run/screen セッション公開 screen セッション share を立てる ## parent console parent@test:~$ screen -S share child ユーザへ share セッションを共有する ## parent console parent@test:~$ ( Ctrl+a ) :multiuser on Multiuser mode enabled parent@test:~$ ( Ctrl+a ) :acladd child parent@test:~$ セッション参加 parent ユーザが立てた screen のセッション名を確認し、乗り込む ## child console child@test:~$ screen -ls parent/ There is a suitable screen on: 1448 .share ( 03 /07/2017 10 :49:09 AM ) ( Multi, attached ) 1 Socket in /var/run/screen/S-parent. child@test:~$ screen -x parent/share ログアウトとデタッチの動作 parent ユーザが screen セッションとして起動されている login セッションからログアウトする ## parent console parent@test:~$ exit [ screen is terminating ] parent@test:~$ child ユーザが screen セッションとして起動されている login セッションからログアウトする ## child console parent@test:~$ exit [ screen is terminating ] child@test:~$ parent ユーザが screen セッション share をデタッチする ## parent console parent@test:~$ ( Ctrl+A ) ( d ) [ detached from 1448 .share ] parent@test:~$ child ユーザが screen セッション share をデタッチする ## child console parent@test:~$ ( Ctrl+A ) ( d ) [ detached from 1448 .share ] child@test:~$","tags":"howto","url":"https://coleyon.github.io/screen.html","loc":"https://coleyon.github.io/screen.html"}]};