#pragma strict

class CreateRoleConfig
{
    static var data: Boo.Lang.Hash =
    {
    "girl": {"hair_list": [{"model": "hair_1050000.mod.u3d", 
                            "mats": ["hair_1050000_00.mat.u3d", 
                                     "hair_1050000_01.mat.u3d", 
                                     "hair_1050000_02.mat.u3d", 
                                     "hair_1050000_03.mat.u3d"]},
                           {"model": "hair_1050001.mod.u3d", 
                            "mats": ["hair_1050001_00.mat.u3d", 
                                     "hair_1050001_01.mat.u3d", 
                                     "hair_1050001_02.mat.u3d", 
                                     "hair_1050001_03.mat.u3d"]},
                           {"model": "hair_1050002.mod.u3d", 
                            "mats": ["hair_1050002_00.mat.u3d", 
                                     "hair_1050002_01.mat.u3d", 
                                     "hair_1050002_02.mat.u3d", 
                                     "hair_1050002_03.mat.u3d"]},
                           {"model": "hair_1050004.mod.u3d", 
                            "mats": ["hair_1050004_00.mat.u3d", 
                                     "hair_1050004_01.mat.u3d", 
                                     "hair_1050004_02.mat.u3d", 
                                     "hair_1050004_03.mat.u3d"]},
                           {"model": "hair_1050005.mod.u3d", 
                            "mats": ["hair_1050005_00.mat.u3d", 
                                     "hair_1050005_01.mat.u3d", 
                                     "hair_1050005_02.mat.u3d", 
                                     "hair_1050005_03.mat.u3d"]},
                           {"model": "hair_1050006.mod.u3d", 
                            "mats": ["hair_1050006_00.mat.u3d", 
                                     "hair_1050006_01.mat.u3d", 
                                     "hair_1050006_02.mat.u3d", 
                                     "hair_1050006_03.mat.u3d"]},
                           {"model": "hair_1050007.mod.u3d", 
                            "mats": ["hair_1050007_00.mat.u3d", 
                                     "hair_1050007_01.mat.u3d", 
                                     "hair_1050007_02.mat.u3d", 
                                     "hair_1050007_03.mat.u3d"]},
                           {"model": "hair_1050008.mod.u3d", 
                            "mats": ["hair_1050008_00.mat.u3d", 
                                     "hair_1050008_01.mat.u3d", 
                                     "hair_1050008_02.mat.u3d", 
                                     "hair_1050008_03.mat.u3d"]},
                           {"model": "hair_1050009.mod.u3d", 
                            "mats": ["hair_1050009_00.mat.u3d", 
                                     "hair_1050009_01.mat.u3d", 
                                     "hair_1050009_02.mat.u3d", 
                                     "hair_1050009_03.mat.u3d"]}
                          ],
             "face_list": [{"model": "face_1150000.mod.u3d", 
                            "mats": ["face_1150000_00.mat.u3d", 
                                     "face_1150000_01.mat.u3d", 
                                     "face_1150000_02.mat.u3d", 
                                     "face_1150000_03.mat.u3d"]},
                           {"model": "face_1150001.mod.u3d", 
                            "mats": ["face_1150001_00.mat.u3d", 
                                     "face_1150001_01.mat.u3d", 
                                     "face_1150001_02.mat.u3d", 
                                     "face_1150001_03.mat.u3d"]},
                           {"model": "face_1150002.mod.u3d", 
                            "mats": ["face_1150002_00.mat.u3d", 
                                     "face_1150002_01.mat.u3d", 
                                     "face_1150002_02.mat.u3d", 
                                     "face_1150002_03.mat.u3d"]},
                           {"model": "face_1150003.mod.u3d", 
                            "mats": ["face_1150003_00.mat.u3d", 
                                     "face_1150003_01.mat.u3d", 
                                     "face_1150003_02.mat.u3d", 
                                     "face_1150003_03.mat.u3d"]},
                           {"model": "face_1150004.mod.u3d", 
                            "mats": ["face_1150004_00.mat.u3d", 
                                     "face_1150004_01.mat.u3d", 
                                     "face_1150004_02.mat.u3d", 
                                     "face_1150004_03.mat.u3d"]},
                           {"model": "face_1150005.mod.u3d", 
                            "mats": ["face_1150005_00.mat.u3d", 
                                     "face_1150005_01.mat.u3d", 
                                     "face_1150005_02.mat.u3d", 
                                     "face_1150005_03.mat.u3d"]}
                          ],
             "eyelid_list": [{"model": "body_0960000.mod.u3d", 
                            "mats": ["body_0960000_00-01.mat.u3d", 
                                     "body_0960000_01-01.mat.u3d", 
                                     "body_0960000_02-01.mat.u3d", 
                                     "body_0960000_03-01.mat.u3d",
                                     "body_0960000_00-02.mat.u3d"]}
                          ],
             "body_list": [{"model": "body_0950000.mod.u3d", 
                            "mats": ["body_0950000_00.mat.u3d", 
                                     "body_0950000_01.mat.u3d", 
                                     "body_0950000_02.mat.u3d", 
                                     "body_0950000_03.mat.u3d"]}
                          ],
             "beard_list": [{"model": "",
                             "mats": ["",
                                      "",
                                      "",
                                      ""]}],
             "clothes_list": [350000, // 填物品id
                              350001,
                              350002
                              ],
             "shoes_list":   [550000, // 填物品id
                              550001,
                              550002
                              ],           
             "animation_list": [{"ani": "stand1",     "loop_count": 5},  // 动画, 循环次数
                                {"ani": "standby1-2", "loop_count": 1},
                                {"ani": "stand2",     "loop_count": 5},
                                {"ani": "standby2-3", "loop_count": 1},
                                {"ani": "stand3",     "loop_count": 5},
                                {"ani": "standby3-4", "loop_count": 1},
                                {"ani": "stand4",     "loop_count": 5},
                                {"ani": "standby4-1", "loop_count": 1}
                               ],
             "scale": 1.0,                               // 人物比例                      
             "position": {"x": 0.05, "y": -0.975, "z": 2.10},// 女玩家初始位置      
             "rotation": {"x": 0.0, "y": 278.6, "z": 0.0}      // 女玩家初始角度    
             },
    "boy":  {"hair_list": [{"model": "hair_1000000.mod.u3d", 
                             "mats": ["hair_1000000_00.mat.u3d", 
                                      "hair_1000000_01.mat.u3d", 
                                      "hair_1000000_02.mat.u3d", 
                                      "hair_1000000_03.mat.u3d"]},
                            {"model": "hair_1000002.mod.u3d", 
                             "mats": ["hair_1000002_00.mat.u3d", 
                                      "hair_1000002_01.mat.u3d", 
                                      "hair_1000002_02.mat.u3d", 
                                      "hair_1000002_03.mat.u3d"]},
                            {"model": "hair_1000003.mod.u3d", 
                             "mats": ["hair_1000003_00.mat.u3d", 
                                      "hair_1000003_01.mat.u3d", 
                                      "hair_1000003_02.mat.u3d", 
                                      "hair_1000003_03.mat.u3d"]},
                            {"model": "hair_1000004.mod.u3d", 
                             "mats": ["hair_1000004_00.mat.u3d", 
                                      "hair_1000004_01.mat.u3d", 
                                      "hair_1000004_02.mat.u3d", 
                                      "hair_1000004_03.mat.u3d"]},
                            {"model": "hair_1000005.mod.u3d", 
                             "mats": ["hair_1000005_00.mat.u3d", 
                                      "hair_1000005_01.mat.u3d", 
                                      "hair_1000005_02.mat.u3d", 
                                      "hair_1000005_03.mat.u3d"]},
                            {"model": "hair_1000006.mod.u3d", 
                             "mats": ["hair_1000006_00.mat.u3d", 
                                      "hair_1000006_01.mat.u3d", 
                                      "hair_1000006_02.mat.u3d", 
                                      "hair_1000006_03.mat.u3d"]},
                            {"model": "hair_1000007.mod.u3d", 
                             "mats": ["hair_1000007_00.mat.u3d", 
                                      "hair_1000007_01.mat.u3d", 
                                      "hair_1000007_02.mat.u3d", 
                                      "hair_1000007_03.mat.u3d"]},
                            {"model": "hair_1000008.mod.u3d", 
                             "mats": ["hair_1000008_00.mat.u3d", 
                                      "hair_1000008_01.mat.u3d", 
                                      "hair_1000008_02.mat.u3d", 
                                      "hair_1000008_03.mat.u3d"]},
                            {"model": "hair_1000009.mod.u3d", 
                             "mats": ["hair_1000009_00.mat.u3d", 
                                      "hair_1000009_01.mat.u3d", 
                                      "hair_1000009_02.mat.u3d", 
                                      "hair_1000009_03.mat.u3d"]},
                            {"model": "hair_1000010.mod.u3d", 
                             "mats": ["hair_1000010_00.mat.u3d", 
                                      "hair_1000010_01.mat.u3d", 
                                      "hair_1000010_02.mat.u3d", 
                                      "hair_1000010_03.mat.u3d"]}
                          ],
             "face_list": [{"model": "face_1100000.mod.u3d", 
                            "mats": ["face_1100000_00.mat.u3d", 
                                     "face_1100000_01.mat.u3d", 
                                     "face_1100000_02.mat.u3d", 
                                     "face_1100000_03.mat.u3d"]},
                           {"model": "face_1100001.mod.u3d", 
                            "mats": ["face_1100001_00.mat.u3d", 
                                     "face_1100001_01.mat.u3d", 
                                     "face_1100001_02.mat.u3d", 
                                     "face_1100001_03.mat.u3d"]},
                           {"model": "face_1100002.mod.u3d", 
                            "mats": ["face_1100002_00.mat.u3d", 
                                     "face_1100002_01.mat.u3d", 
                                     "face_1100002_02.mat.u3d", 
                                     "face_1100002_03.mat.u3d"]},
                           {"model": "face_1100003.mod.u3d", 
                            "mats": ["face_1100003_00.mat.u3d", 
                                     "face_1100003_01.mat.u3d", 
                                     "face_1100003_02.mat.u3d", 
                                     "face_1100003_03.mat.u3d"]},
                           {"model": "face_1100004.mod.u3d", 
                            "mats": ["face_1100004_00.mat.u3d", 
                                     "face_1100004_01.mat.u3d", 
                                     "face_1100004_02.mat.u3d", 
                                     "face_1100004_03.mat.u3d"]},
                           {"model": "face_1100005.mod.u3d", 
                            "mats": ["face_1100005_00.mat.u3d", 
                                     "face_1100005_01.mat.u3d", 
                                     "face_1100005_02.mat.u3d", 
                                     "face_1100005_03.mat.u3d"]}
                          ],
             "eyelid_list": [{"model": "body_0910000.mod.u3d", 
                            "mats": ["body_0910000_00-01.mat.u3d", 
                                     "body_0910000_01-01.mat.u3d", 
                                     "body_0910000_02-01.mat.u3d", 
                                     "body_0910000_03-01.mat.u3d",
                                     "body_0910000_00-02.mat.u3d"]}
                          ],
             "body_list": [{"model": "body_0900000.mod.u3d", 
                            "mats": ["body_0900000_00.mat.u3d", 
                                     "body_0900000_01.mat.u3d", 
                                     "body_0900000_02.mat.u3d", 
                                     "body_0900000_03.mat.u3d"]}
                          ],
             "beard_list": [{"model": "",
                             "mats": ["",
                                      "",
                                      "",
                                      ""]},
                            {"model": "beard_1200000.mod.u3d", 
                             "mats": ["beard_1200000_00.mat.u3d", 
                                      "beard_1200000_01.mat.u3d", 
                                      "beard_1200000_02.mat.u3d", 
                                      "beard_1200000_03.mat.u3d"]},
                            {"model": "beard_1200001.mod.u3d", 
                             "mats": ["beard_1200001_00.mat.u3d", 
                                      "beard_1200001_01.mat.u3d", 
                                      "beard_1200001_02.mat.u3d", 
                                      "beard_1200001_03.mat.u3d"]},
                            {"model": "beard_1200002.mod.u3d", 
                             "mats": ["beard_1200002_00.mat.u3d", 
                                      "beard_1200002_01.mat.u3d", 
                                      "beard_1200002_02.mat.u3d", 
                                      "beard_1200002_03.mat.u3d"]},
                            {"model": "beard_1200003.mod.u3d", 
                             "mats": ["beard_1200003_00.mat.u3d", 
                                      "beard_1200003_01.mat.u3d", 
                                      "beard_1200003_02.mat.u3d", 
                                      "beard_1200003_03.mat.u3d"]}
                           ],
             "clothes_list": [300000, // 填物品id
                              300001,
                              300002
                              ],
             "shoes_list":   [500000, // 填物品id
                              500001,
                              500002
                              ],
             "animation_list": [{"ani": "stand1",     "loop_count": 5},  // 动画, 循环次数
                                {"ani": "standby1-2", "loop_count": 1},
                                {"ani": "stand2",     "loop_count": 5},
                                {"ani": "standby2-3", "loop_count": 1},
                                {"ani": "stand3",     "loop_count": 5},
                                {"ani": "standby3-4", "loop_count": 1},
                                {"ani": "stand4",     "loop_count": 5},
                                {"ani": "standby4-1", "loop_count": 1}
                               ],                 
             "scale": 0.95,                             // 人物比例                      
             "position": {"x": 0.02, "y": -0.975, "z": 2.263},// 男玩家初始位置  
             "rotation": {"x": 0.0, "y": 278.6, "z": 0.0}   // 男玩家初始角度    
             },
    "camera_angle_x": 3.8,                        // 相机角度
    "rotate_setting": {"angle": 60.0, "time": 0.5}  // 每次旋转设定
    };
}
