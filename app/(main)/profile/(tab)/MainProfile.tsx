import React, {useState} from 'react';
import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {IProfile} from "@/lib/redux/api";

const MainProfile = ({profile,isEditing,setIsEditing}:{profile?: IProfile, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>, isEditing: boolean}) => {

    return  <TabsContent value="profile">
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isEditing ? (
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" defaultValue={profile?.fullName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={profile?.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profilePicture">Profile Picture</Label>
                            <Input id="profilePicture" type="file" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" placeholder="Tell us about yourself" />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit">Save Changes</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium">Full Name</h3>
                            <p className="text-muted-foreground">{profile?.fullName}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Email</h3>
                            <p className="text-muted-foreground">{profile?.email}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Bio</h3>
                            <p className="text-muted-foreground">No bio provided</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </TabsContent>
};

export default MainProfile;
