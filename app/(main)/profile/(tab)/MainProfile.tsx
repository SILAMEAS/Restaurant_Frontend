import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {IProfile} from "@/lib/redux/type";
import {ImageDropzone} from "../(component)/ImageDropzone";
import useDropzoneCustom from "../(component)/useDropzoneCustom";

interface MainProfileProps {
    profile?: IProfile;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    onUpdateProfile?: (formData: FormData) => Promise<void>;
}

const MainProfile = ({profile, isEditing, setIsEditing, onUpdateProfile}: MainProfileProps) => {
    const dropzoneCustom = useDropzoneCustom();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        bio: ''
    });

    // Update form data when profile changes or entering edit mode
    useEffect(() => {
        if (profile && isEditing) {
            setFormData({
                fullName: profile.fullName || '',
                email: profile.email || '',
                bio: profile.bio || ''
            });
            
            // Set profile image if it exists
            if (profile.profileImage) {
                dropzoneCustom.setImagePreviewUrl({
                    url: profile.profileImage,
                    publicId: null
                });
            }
        }
    }, [profile, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onUpdateProfile) return;

        const submitData = new FormData();
        submitData.append('fullName', formData.fullName);
        submitData.append('email', formData.email);
        submitData.append('bio', formData.bio);
        
        if (dropzoneCustom.imageFile) {
            submitData.append('profileImage', dropzoneCustom.imageFile);
        }

        await onUpdateProfile(submitData);
        setIsEditing(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="profileImage">Profile Picture</Label>
                                <ImageDropzone dropzoneCustom={dropzoneCustom} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input 
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email"
                                    name="email"
                                    type="email"
                                    disabled={true}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea 
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself"
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
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
                                <p className="text-muted-foreground">
                                    {profile?.bio || "No bio provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MainProfile;
