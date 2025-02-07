import React from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CourseCategory = () => {
    const navigate = useNavigate();
    const departments = ["経済学科", "経営学科", "法律学科", "人間学科", "教育学科", "児童教育学科", "情報システム工学科", "共生創造理工学科", "看護学科", "国際教養学科",
        "基礎科目", "大学科目", "英語科目", "第二言語科目", "世界市民教育科目", "数理・データサイエンス・自然", "人文・社会・健康科目", "キャリア教育系科目", "海外研修・実習科目"
    ];
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <h1 className="text-2xl font-bold m-4">カテゴリー一覧</h1>
            <div className="grid grid-cols-2 gap-4">
                {departments.map((department) => (
                    <Card key={department}>
                        <CardHeader>
                            <CardTitle>{department}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => navigate(`/course/department/${department}`)}
                                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                授業一覧
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
export default CourseCategory;