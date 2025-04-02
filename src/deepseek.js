// 用于调用 DeepSeek API 分析任务文字
export async function parseTask(text) {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const endpoint = '/api/deepseek'
  
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
            {
                role: 'system',
                content: `你是一个日程管理助手。用户会输入一句自然语言的日语句子，请你从这句话中识别「用户输入的日子和活动内容本身」，并转换为如下 JSON：
              
              {
                "datetime": "YYYY-MM-DD HH:mm",
                "content": "...",
                "duration": "HH:mm",
                "type": "...",
                "deadline": "YYYY-MM-DD", // 仅限 type 为 task 时出现
                "remindAt": "2025-06-29" // 仅限 type 为 reminder 时出现
              }
              
              【规则】
              - 只能从用户输入中提取信息，不能更换或添加内容。
              - "datetime" 字段写出用户输入中提到的日期和时间，必须是未来最近的日期，并用 24 小时格式。
              - "content" 字段保留用户原意，不得自动更换为“打ち合わせ”“歯医者”等默认词汇。
              - 当前时间是「${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}」。
              - 用户如果没有写时间，默认时间为 09:00。
              - 如果提到了时间段（如「朝」「昼」「午後」「夜」），请转化为具体时间：
                - 朝 → 07:00
                - 昼 → 12:00
                - 午後 → 13:00
                - 夜 → 18:00
              - 如果用户说了「〜から〜まで」或明确写出开始和结束时间，请计算出开始时间，并设定 "duration" 字段（例如 "01:30"）。
              - 如果用户没有提及结束时间或时长，请根据内容自动推测一个常见的时长作为 "duration"，如：
                - 会議、打ち合わせ、相談など → 01:00
                - 映画を見る、デート → 02:00
                - 食事、ランチ → 01:00
                - 買い物 → 01:30
                - 公園に行く、散歩 → 00:30
                - それ以外 → 01:00
              - "content" 字段必须保留用户的活动原意，但请转换为自然简洁的日本語命令形，如「〜に行きたい」请改为「〜に行く」。不要自动更换为通用词汇（如“打ち合わせ”“歯医者”等）。
             - 请根据以下规则，判断任务的类型并加入 "type" 字段：

                - "schedule"：用户输入中有明确的“日期 + 时间点”或“起止时间段”（如 14時、2025-04-01 18:00 等），表示某个具体时刻发生的事件。
                - "task"：用户表达了一个要完成的事情，有“截止时间”但没有具体时间点（如 “今週中に提出”、“来週までに整理”）。
                - "reminder"：没有明确时间，也没有具体截止，只是一个提醒或轻量提示（如“忘れずに〜”、“念のため〜”）。

                - 如果是 "task"，请尝试提取其截止日期作为 "deadline" 字段（格式为 YYYY-MM-DD），如没有写明则忽略。
                - 如果是 "reminder"，且表达了提醒时间（如“3ヶ月後”），请自动换算为合理日期写入 "remindAt" 字段。
             - 请选择最合适的一个类型填入 type 字段。禁止使用多个或空值。
              - 输出必须是 JSON 本身，禁止加入任何多余内容、注释或格式标记。
              `
              },
              {
                role: 'user',
                content: text  // 👈 你输入框的内容，比如：日曜日 公園行きたい
              }
              
        ]
      })
    })
  
    const data = await res.json()
    return data.choices[0].message.content
  }
  