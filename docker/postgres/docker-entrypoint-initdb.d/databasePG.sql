-- 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 初始化标记表
CREATE TABLE IF NOT EXISTS init_markers (
    key VARCHAR(100) PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    contact VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    status SMALLINT DEFAULT 1,
    last_login_at TIMESTAMPTZ NULL,
    description TEXT DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    role SMALLINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    default_since TIMESTAMPTZ DEFAULT NULL,
    CONSTRAINT unique_default_since UNIQUE (default_since)
);

-- 失物表
CREATE TABLE IF NOT EXISTS lost_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INT NOT NULL REFERENCES categories(id),
    description TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    location VARCHAR(255) NOT NULL,
    status SMALLINT NOT NULL DEFAULT 0,
    image VARCHAR(255) DEFAULT NULL,
    user_id INT NOT NULL REFERENCES users(id),
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- 招领表
CREATE TABLE IF NOT EXISTS found_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INT NOT NULL REFERENCES categories(id),
    description TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    location VARCHAR(255) NOT NULL,
    storage_location VARCHAR(255) DEFAULT NULL,
    contact_phone VARCHAR(20) DEFAULT NULL,
    status SMALLINT NOT NULL DEFAULT 0,
    image VARCHAR(255) DEFAULT NULL,
    view_count INT DEFAULT 0,
    user_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    parent_id INT DEFAULT NULL REFERENCES comments(id) ON DELETE CASCADE,
    item_id INT NOT NULL,
    content TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    user_id INT NOT NULL REFERENCES users(id),
    item_type SMALLINT NOT NULL,
    root_id INT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_root_id ON comments(root_id);

-- 评论点赞表
CREATE TABLE IF NOT EXISTS comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id INT NOT NULL REFERENCES comments(id),
    user_id INT NOT NULL REFERENCES users(id),
    like_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 公告表
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    author_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- 公告附件表
CREATE TABLE IF NOT EXISTS announcement_attachments (
    id SERIAL PRIMARY KEY,
    announcement_id INT NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    file_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 举报原因字典表
CREATE TABLE IF NOT EXISTS report_reasons (
    id SERIAL PRIMARY KEY,
    reason_text VARCHAR(100) NOT NULL,
    target_type SMALLINT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active SMALLINT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 举报主表
CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT NOT NULL REFERENCES users(id),
    target_type SMALLINT NOT NULL,
    target_id BIGINT NOT NULL,
    reason_id INT DEFAULT NULL REFERENCES report_reasons(id),
    reason_desc VARCHAR(500) DEFAULT NULL,
    evidence_images JSONB DEFAULT NULL,
    snapshot JSONB NOT NULL,
    status SMALLINT NOT NULL DEFAULT 0,
    handler_id BIGINT DEFAULT NULL REFERENCES users(id),
    handled_at TIMESTAMPTZ DEFAULT NULL,
    handling_result VARCHAR(200) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reporter_target ON reports(reporter_id, target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_status ON reports(status);

-- 处罚记录表
CREATE TABLE IF NOT EXISTS punishments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    type SMALLINT NOT NULL,
    duration_days INT DEFAULT NULL,
    expire_at TIMESTAMPTZ DEFAULT NULL,
    reason VARCHAR(500) DEFAULT NULL,
    handler_id BIGINT NOT NULL REFERENCES users(id),
    report_id BIGINT DEFAULT NULL REFERENCES reports(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_punishment_user_id ON punishments(user_id);
CREATE INDEX IF NOT EXISTS idx_punishment_expire_at ON punishments(expire_at);

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    type SMALLINT NOT NULL,
    message VARCHAR(500) NOT NULL,
    target_id BIGINT DEFAULT NULL,
    target_type VARCHAR(50) DEFAULT NULL,
    related_user_id BIGINT DEFAULT NULL REFERENCES users(id),
    related_user_name VARCHAR(255) DEFAULT NULL,
    read_status SMALLINT NOT NULL DEFAULT 0,
    read_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_related_user ON notifications(related_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- 知识库表（pgvector）
CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    type VARCHAR(50) DEFAULT 'faq',
    source_file VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON knowledge_base USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_source ON knowledge_base(source_file);

-- ========== 种子数据（只插入一次）==========
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM init_markers WHERE key = 'seed_v1') THEN
        -- 插入分类
        INSERT INTO categories (name) VALUES
        ('电子产品'), ('证件卡包'), ('生活用品'), ('服饰'), ('学习用品'), ('其他');

        -- 插入用户
        INSERT INTO users (name, avatar, contact, email, description, password, role) VALUES
        ('管理员', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=admin%20user%20avatar&image_size=square', '13800000000', 'admin@example.com', '系统管理员', '$2b$10$HJa7vgNkUZ7faf8WWpiG4..IJ7iOVaVl8BEIDEesrPkmkYlZPEyrG', 1),
        ('张三', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student&image_size=square', '13800001234', 'zhangsan@example.com', '计算机科学与技术专业，热爱编程和运动', '$2b$10$HJa7vgNkUZ7faf8WWpiG4..IJ7iOVaVl8BEIDEesrPkmkYlZPEyrG', 0),
        ('李四', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20female%20student&image_size=square', '13900005678', 'lisi@example.com', '英语专业，喜欢阅读和旅行', '$2b$10$HJa7vgNkUZ7faf8WWpiG4..IJ7iOVaVl8BEIDEesrPkmkYlZPEyrG', 0),
        ('王五', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student%20glasses&image_size=square', '13700009012', 'wangwu@example.com', '物理学专业，喜欢实验和阅读', '$2b$10$HJa7vgNkUZ7faf8WWpiG4..IJ7iOVaVl8BEIDEesrPkmkYlZPEyrG', 0),
        ('赵六', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20female%20student%20smile&image_size=square', '13600003456', 'zhaoliu@example.com', '体育教育专业，喜欢各种运动', '$2b$10$HJa7vgNkUZ7faf8WWpiG4..IJ7iOVaVl8BEIDEesrPkmkYlZPEyrG', 0),
        ('孙七', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20male%20student%20casual&image_size=square', '13500007890', 'sunqi@example.com', '数学专业，喜欢解题和研究', '$2b$10$HJa7vgNkUZ7faf8WWpiG4..IJ7iOVaVl8BEIDEesrPkmkYlZPEyrG', 0);

        -- 插入失物
        INSERT INTO lost_items (title, category_id, description, time, location, status, image, user_id, view_count) VALUES
        ('蓝色笔记本电脑', 1, '联想小新Pro，蓝色外壳，有轻微划痕，于2024年2月20日在图书馆三楼丢失。电脑内有重要的学习资料和项目文件，希望捡到的同学能够联系我，必有重谢！', '2024-02-20 10:00:00', '图书馆三楼', 0, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laptop%20blue%20lenovo%20%E5%B0%8F%E6%96%B0Pro&image_size=landscape_16_9', 1, 25),
        ('黑色钱包', 2, '黑色皮质钱包，内有身份证、学生证和银行卡，于2024年2月19日在食堂二楼丢失。钱包是我刚买的，里面还有一些现金和重要证件，希望捡到的同学能够联系我，必有酬谢！', '2024-02-19 15:30:00', '食堂二楼', 0, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20leather%20wallet%20men%20style&image_size=landscape_16_9', 2, 18),
        ('红色雨伞', 3, '折叠式红色雨伞，伞柄有小熊图案，于2024年2月18日在教学楼A座丢失。这把雨伞是我生日时朋友送的，对我来说很有意义，希望捡到的同学能够联系我，非常感谢！', '2024-02-18 17:00:00', '教学楼A座', 1, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20foldable%20umbrella%20bear%20pattern&image_size=landscape_16_9', 3, 15),
        ('白色运动鞋', 4, '耐克白色运动鞋，尺码42，于2024年2月17日在体育馆丢失。这双鞋是我上个月刚买的，很喜欢，希望捡到的同学能够联系我，必有酬谢！', '2024-02-17 18:30:00', '体育馆', 0, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20sports%20shoes%20nike&image_size=landscape_16_9', 4, 12),
        ('数学课本', 5, '高等数学上册，封面有笔记，于2024年2月16日在教室302丢失。这本书对我来说非常重要，里面有很多课堂笔记和习题解答，希望捡到的同学能够联系我，非常感谢！', '2024-02-16 16:00:00', '教室302', 1, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mathematics%20textbook%20college%20level&image_size=landscape_16_9', 5, 10);

        -- 插入招领
        INSERT INTO found_items (title, category_id, description, time, location, storage_location, contact_phone, status, image, user_id, view_count) VALUES
        ('白色AirPods', 1, '白色AirPods耳机，带充电盒，于2024年2月20日在操场捡到。', '2024-02-20 10:00:00', '操场', '失物招领中心', '13800001234', 0, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20AirPods%20with%20charging%20case&image_size=landscape_16_9', 3, 20),
        ('数学课本', 5, '高等数学上册，封面有笔记，于2024年2月19日在教室302捡到。', '2024-02-19 15:30:00', '教室302', '失物招领中心', '13800001234', 0, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mathematics%20textbook%20college%20level&image_size=landscape_16_9', 3, 15),
        ('运动水杯', 3, '蓝色运动水杯，带刻度，于2024年2月18日在体育馆捡到。', '2024-02-18 18:00:00', '体育馆', '失物招领中心', '13800001234', 1, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20sports%20water%20bottle%20with%20scale&image_size=landscape_16_9', 3, 18),
        ('黑色钱包', 2, '黑色钱包，内有身份证和银行卡，于2024年2月21日在食堂捡到。', '2024-02-21 12:00:00', '食堂', '失物招领中心', '13800001234', 0, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20wallet&image_size=landscape_16_9', 3, 22),
        ('蓝色雨伞', 3, '蓝色雨伞，于2024年2月22日在教学楼捡到。', '2024-02-22 18:00:00', '教学楼', NULL, NULL, 0, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20umbrella&image_size=landscape_16_9', 3, 12);

        -- 插入公告
        INSERT INTO announcements (title, content, time, author_id) VALUES
        ('关于加强校园失物招领管理的通知', '为了更好地服务广大师生，即日起加强失物招领信息的审核和管理，确保信息的真实性和有效性。请各位同学在发布信息时务必填写真实有效的联系方式，以便失物能够及时归还。', '2024-02-20 10:00:00', 1),
        ('本周失物招领统计', '本周共收到失物信息23条，招领信息18条，已成功匹配12条。其中电子产品类物品丢失最多，占比45%；其次是证件卡包类，占比25%。请同学们注意保管好个人物品。', '2024-02-18 10:00:00', 1),
        ('重要提醒：考试周注意保管个人物品', '考试周期间，图书馆、教室人流量大，请同学们注意保管好个人物品，特别是身份证、学生证、银行卡等重要证件。如有物品丢失，请及时在平台发布信息。', '2024-02-15 10:00:00', 1),
        ('失物招领平台使用指南', '为了帮助新同学更好地使用失物招领平台，我们制作了详细的使用指南。请同学们在发布信息时仔细阅读平台规则，确保信息的准确性和完整性。', '2024-02-10 10:00:00', 1),
        ('关于开展失物招领志愿服务活动的通知', '为了进一步提升校园失物招领服务质量，我们计划开展失物招领志愿服务活动，欢迎有热心的同学报名参加。志愿者将协助管理失物招领信息，帮助失主找回物品。', '2024-02-05 10:00:00', 1);

        -- 插入评论
        INSERT INTO comments (parent_id, item_id, content, time, user_id, item_type) VALUES
        (NULL, 1, '你好，我在图书馆前台看到了一个类似的电脑包，你可以去确认一下', '2024-02-21 10:00:00', 2, 0),
        (NULL, 1, '请问电脑有什么特殊标记吗？我昨天在机房见过一台蓝色的笔记本', '2024-02-21 10:30:00', 3, 0),
        (1, 1, '我刚刚去图书馆前台问了，确实有个电脑包，但工作人员说要核实身份，你方便带学生证过去吗？', '2024-02-21 11:20:00', 3, 0),
        (1, 1, '好的，我马上过去，谢谢你！', '2024-02-21 11:30:00', 1, 0),
        (2, 1, '如果你需要帮忙跑腿的话可以叫我，我今天下午都在学校', '2024-02-21 12:10:00', 4, 0),
        (NULL, 2, '我刚到食堂门口，没看到人，你在哪里？', '2024-02-19 12:55:00', 2, 0),
        (NULL, 2, '抱歉刚才接了个电话，我还在食堂门口，穿红色外套', '2024-02-19 13:00:00', 4, 0),
        (6, 2, '看到了！谢谢你！', '2024-02-19 13:05:00', 2, 0),
        (NULL, 3, '这种红色雨伞我好像也在教学楼B座见过，但不确定是不是同一把', '2024-02-19 09:15:00', 2, 0),
        (9, 3, '能帮我看看还在吗？如果有照片就更好了', '2024-02-19 10:20:00', 3, 0),
        (10, 3, '好的，我中午去B座找一下，有消息告诉你', '2024-02-19 10:30:00', 2, 0),
        (NULL, 1, '耳机是什么颜色的？我的好像是白色的', '2024-02-20 17:00:00', 5, 1),
        (12, 1, '就是白色的，带充电盒', '2024-02-20 17:15:00', 3, 1),
        (13, 1, '那应该是我的，能约个时间在操场还我吗？', '2024-02-20 17:20:00', 5, 1),
        (14, 1, '好的，明天下午3点操场见', '2024-02-20 18:00:00', 3, 1),
        (NULL, 3, '请问水杯还在吗？我想明天去拿', '2024-02-19 14:30:00', 6, 1),
        (16, 3, '还在的，你直接去失物招领中心报我的名字就行', '2024-02-19 15:00:00', 3, 1),
        (NULL, 4, '这双鞋我也有一双，很好穿', '2024-02-18 12:00:00', 2, 0),
        (NULL, 5, '高数真的是太难了', '2024-02-17 08:30:00', 3, 0),
        (NULL, 2, '希望失主早日找到', '2024-02-20 09:00:00', 1, 1);

        -- 插入举报原因
        INSERT INTO report_reasons (reason_text, target_type, sort_order, is_active) VALUES
        ('色情低俗', NULL, 1, 1),
        ('政治敏感', NULL, 2, 1),
        ('诈骗信息', NULL, 3, 1),
        ('人身攻击', NULL, 4, 1),
        ('垃圾广告', NULL, 5, 1),
        ('虚假信息', NULL, 6, 1),
        ('侵犯隐私', NULL, 7, 1),
        ('其他', NULL, 99, 1);

        -- 插入通知
        INSERT INTO notifications (user_id, type, message, target_id, target_type, related_user_id, related_user_name, read_status) VALUES
        (2, 1, '张三点赞了你的评论', 1, 'comment', 3, '张三', 0),
        (2, 2, '李四回复了你的评论', 5, 'comment', 4, '李四', 1),
        (2, 3, '你的账号因违规被管理员处罚：发布虚假信息', 1, 'report', NULL, '管理员', 0);

        -- 标记已完成
        INSERT INTO init_markers (key) VALUES ('seed_v1');
        RAISE NOTICE 'Seed data inserted successfully';
    ELSE
        RAISE NOTICE 'Seed data already exists, skipping';
    END IF;
END $$;
