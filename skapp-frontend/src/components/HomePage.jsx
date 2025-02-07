import React, { } from "react";
import Header from './Header';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header/>
            <h1 className="text-3xl font-bold m-6">CourseReview へようこそ</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>学科一覧</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">大学の全学科をチェックしましょう。</p>
                        <Link to="/course">
                            <Button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">学科を見る</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
export default HomePage;