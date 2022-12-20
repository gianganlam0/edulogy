<?php
require_once __DIR__.'/../Model/UserModel.php';
require_once __DIR__.'/../Utils.php';
$data = json_decode($_POST['data'], true);
$action = $_POST['action'];

$res = array(
    'status' => '',
    'message' => '',
    'data' => ''
);

//if chua dang nhap thì bắt đầu sess
if (!isset($_SESSION)) {
    session_start();
}
if ($action == 'forgotPassword'){
    if (isset($_SESSION['id'])){
        $res['status'] = -1;
        $res['message'] = 'Bạn đã đăng nhập';
        echo json_encode($res);
    }
    else{
        $email = $data['email'];
        $regex = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/';
        if (!preg_match($regex, $email)){
            $res['status'] = -2;
            $res['message'] = 'Email không hợp lệ!';
            echo json_encode($res);
            return;
        }
        try {
            $res = handleForgotPassword($email);
            if ($res['status'] == 0){
                $res['message'] = 'Một email khôi phục mật khẩu đã được gửi đến địa chỉ email của bạn. Vui lòng kiểm tra email để lấy lại mật khẩu.';
                echo json_encode($res);
            }
            else{
                $res['message'] = 'Email không tồn tại.';
                echo json_encode($res);
            }
        } catch (\Throwable $th) {
            $res['status'] = -3;
            $res['message'] = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            echo json_encode($res);
        }
    }

}
else if (!isset($_SESSION['id'])) {
    $res['status'] = -1;
    $res['message'] = 'Bạn chưa đăng nhập!';
    echo json_encode($res);
}
else {
    if ($action == 'getMyInfo'){
        $id = $_SESSION['id'];
        try {
            echo json_encode(getInfo($id));
        }
        catch (Throwable $th) {
            $res['status'] = -1;
            $res['message'] = 'Đã có lỗi xảy ra!';
            echo json_encode($res);
        }
    }
    else if ($action == 'getAnotherInfo') {
        $regex = '/^[0-9]+$/';
        $id = $data['id'];
        if (preg_match($regex, $id)) {
            if ($id == '1'){ //id của người dùng guest
                $res['status'] = -2;
                $res['message'] = 'ID không hợp lệ!';
                echo json_encode($res);
                return;
            }
            try {
                $res = getInfo($id);
                unset($res['data']['phone']);
                unset($res['data']['IDNumber']);
                unset($res['data']['sex']);
                unset($res['data']['birthday']);
                unset($res['data']['deletehash']);
                if ($_SESSION['role'] != 2){
                    unset($res['data']['balance']);
                }
                echo json_encode($res);
                return;
            }
            catch (Throwable $th) {
                $res['status'] = -2;
                $res['message'] = 'Không tìm thấy người dùng!';
                echo json_encode($res);
                return;
            }
        }
        else {
            $res['status'] = -2;
            $res['message'] = 'ID không hợp lệ!';
            echo json_encode($res);
            return;
        }
        
    }
    else if ($action == 'updateMyInfo'){
        $id = $data['id'];
        $lastname = $data['lastname'];
        $firstname = $data['firstname'];
        $phone = $data['phone'];
        $IDNumber = $data['IDNumber'];
        $sex = $data['sex'];
        $birthday = $data['birthday'];
        $email = $data['email'];
        $desc = $data['desc'];
        $role = null;
        $avatar = null;
        $avaFile = null;
        $deleteHash = null; // for delete old avatar
        if (isset($data['avatar'])){
            $avatar = $data['avatar'];
        }
        else {
            $avaFile = $_FILES['avatar'];
        }
        

        if ($_SESSION['role'] == 2){
            $role = $data['role'];
        }
        else {
            $role = $_SESSION['role'];
        }
        //now validate
        $regex = '/^[0-9]+$/';
        if (!preg_match($regex, $id)){
            $res['status'] = -2;
            $res['message'] = 'ID không hợp lệ!';
            echo json_encode($res);
            return;
        }
        $regex = "/^[\p{L}'-]+( [\p{L}'-]+)*$/u";
        if (!preg_match($regex, $lastname)){
            $res['status'] = -2;
            $res['message'] = 'Họ không hợp lệ!';
            echo json_encode($res);
            return;
        }
        if (!preg_match($regex, $firstname)){
            $res['status'] = -2;
            $res['message'] = 'Tên không hợp lệ!';
            echo json_encode($res);
            return;
        }
        $regex = '/^[0-9]{10,}$/';
        if (!preg_match($regex, $phone) && $phone != ''){
            $res['status'] = -2;
            $res['message'] = 'Số điện thoại không hợp lệ!';
            echo json_encode($res);
            return;
        }
        $regex = '/^[0-9]{9,12}$/';
        if (!preg_match($regex, $IDNumber) && $IDNumber != ''){
            $res['status'] = -2;
            $res['message'] = 'Số CMND không hợp lệ!';
            echo json_encode($res);
            return;
        }
        $regex = '/^[0-2]$/';
        if (!preg_match($regex, $sex)){
            $res['status'] = -2;
            $res['message'] = 'Giới tính không hợp lệ!';
            echo json_encode($res);
            return;
        }
        $regex = '/^[0-2]$/';
        if (!preg_match($regex, $role)){
            $res['status'] = -2;
            $res['message'] = 'Quyền không hợp lệ!';
            echo json_encode($res);
            return;
        }
        $regex = '/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/';
        if (preg_match($regex, $birthday)){
            //check if birthday is larger than current date
            $date = new DateTime($birthday);
            $now = new DateTime();
            //date > now or year of date < 1800
            if ($date > $now || $date->format('Y') < 1800){
                $res['status'] = -2;
                $res['message'] = 'Ngày sinh không hợp lệ!';
                echo json_encode($res);
                return;
            }
        }
        else if ($birthday != '') {
            $res['status'] = -2;
            $res['message'] = 'Định dạng ngày sinh không hợp lệ!';
            echo json_encode($res);
            return;
        }
        $regex = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/';
        if (!preg_match($regex, $email)){
            $res['status'] = -2;
            $res['message'] = 'Email không hợp lệ!';
            echo json_encode($res);
            return;
        }
        //done validating

        if ($id != $_SESSION['id']){
            $res['status'] = -2;
            $res['message'] = 'ID không hợp lệ!';
            echo json_encode($res);
            return;
        }
        // echo $avatar;
        if ($avatar == null){ //$avaFile là 1 file
            if ($avaFile['size'] > 1024*1024*5){
                $res['status'] = -2;
                $res['message'] = 'Kích thước ảnh quá lớn!';
                echo json_encode($res);
                return;
            }
            $uploadRes = uploadImgur($avaFile);
            $avatar = $uploadRes->link;
            $deleteHash = $uploadRes->deletehash;      
        }
        else {
            //check if $avatar is a url http or https
            $regex = '/^https?:\/\//';
            if (!preg_match($regex, $avatar)){
                $res['status'] = -2;
                $res['message'] = 'Avatar không hợp lệ!';
                echo json_encode($res);
                return;
            }
            //else if that link is not a valid image
            else if (!getimagesize($avatar)){
                $res['status'] = -2;
                $res['message'] = 'Avatar không hợp lệ!';
                echo json_encode($res);
                return;
            }
            //else do nothing
        }

        try {
            $res = updateInfo($id, $lastname, $firstname, $phone, $IDNumber, $sex, $birthday, $email, $role, $desc, $avatar, $deleteHash);
            $res['message'] = 'Cập nhật thông tin thành công!';
            $_SESSION['avatar'] = $avatar;
            $_SESSION['role'] = $role;
            $_SESSION['fullname'] = $lastname . ' ' . $firstname;
            echo json_encode($res);
            return;
        } catch (Throwable $th) {
            $res['status'] = -2;
            $res['message'] = 'Đã có lỗi xảy ra!';
            echo json_encode($res);
            return;
        }

    }
    else if ($action == 'updateAnotherInfo'){
        $id = $data['id'];
        $role = null;
        $role = $data['role'];
        if ($_SESSION['role'] != 2){
            $res['status'] = -1;
            $res['message'] = 'Không có quyền!';
            echo json_encode($res);
            return;
        }
        //now validate
        $regex = '/^[0-9]+$/';
        if (!preg_match($regex, $id)){
            $res['status'] = -2;
            $res['message'] = 'ID không hợp lệ!';
            echo json_encode($res);
            return;
        }
        $regex = '/^[0-2]$/';
        if (!preg_match($regex, $role)){
            $res['status'] = -2;
            $res['message'] = 'Quyền không hợp lệ!';
            echo json_encode($res);
            return;
        }
        //end validate
        try {
            $res = updateAnotherInfo($id, $role);
            $res['message'] = 'Cập nhật thông tin thành công!';
            echo json_encode($res);
            return;
        } catch (Throwable $th) {
            $res['status'] = -2;
            $res['message'] = 'Không tìm thấy người dùng!';
            echo json_encode($res);
            return;
        }
    }
    else if ($action == 'deleteAvatar'){
        $id = $data['id'];
        if ($id != $_SESSION['id']){
            $res['status'] = -1;
            $res['message'] = 'Không có quyền!';
            echo json_encode($res);
            return;
        }
        try {
            $res = deleteAvatar($id);
            $res['message'] = 'Xóa ảnh đại diện thành công!';
            echo json_encode($res);
            return;
        } catch (Throwable $th) {
            $res['status'] = -2;
            $res['message'] = 'Không tìm thấy người dùng!';
            echo json_encode($res);
            return;
        }
    }
    else if ($action == 'changePassword'){
        $id = $_SESSION['id'];
        $oldPassword = $data['oldPassword'];
        $newPassword = $data['newPassword'];

        //validate password is a sha256 string (anti sql injection)
        $regex = '/^[a-f0-9]{64}$/';
        if (!preg_match($regex, $oldPassword)){
            $res['status'] = -2;
            $res['message'] = 'Mật khẩu cũ không hợp lệ!';
            echo json_encode($res);
            return;
        }
        if (!preg_match($regex, $newPassword)){
            $res['status'] = -2;
            $res['message'] = 'Mật khẩu mới không hợp lệ!';
            echo json_encode($res);
            return;
        }
        //end validate
        try {
            $res = changePassword($id, $oldPassword, $newPassword);
            if ($res['status'] == 0){
                $res['message'] = 'Đổi mật khẩu thành công!';
            }
            else if ($res['status'] == -1){
                $res['message'] = 'Mật khẩu cũ không đúng!';
            }
            echo json_encode($res);
            return;
        } catch (Throwable $th) {
            $res['status'] = -2;
            $res['message'] = 'Không tìm thấy người dùng!';
            echo json_encode($res);
            return;
        }
    }
    else if ($action == 'recharge'){
        $userid = $_SESSION['id'];
        $amount = $data['amount'];
        $content = $data['content'];
        $regex = '/^[0-9]+$/';
        if (!preg_match($regex, $amount)){
            $res['status'] = -2;
            $res['message'] = 'Số tiền không hợp lệ!';
            echo json_encode($res);
            return;
        }
        else if ($amount < 50000){
            $res['status'] = -2;
            $res['message'] = 'Số tiền phải lớn hơn 50.000!';
            echo json_encode($res);
            return;   
        }
        try {
            $res = recharge($userid, $amount);
            if ($res['status'] == 0){
                $res['message'] = 'Giao dịch đang được xử lý!';
            }
            echo json_encode($res);
            return;
        } catch (Throwable $th) {
            $res['status'] = -2;
            $res['message'] = 'Không tìm thấy người dùng!';
            echo json_encode($res);
            return;
        }
    }
    else if ($action == 'getInfo'){
        $id = $data['id'];
        $regex = '/^[0-9]+$/';
        if (!preg_match($regex, $id)){
            $res['status'] = -2;
            $res['message'] = 'ID không hợp lệ!';
            echo json_encode($res);
            return;
        }
        try {
            $res = getInfo($id);
            if ($res['status'] == 0){
                $res['message'] = 'Lấy thông tin thành công!';
            }
            echo json_encode($res);
            return;
        } catch (Throwable $th) {
            $res['status'] = -2;
            $res['message'] = 'Không tìm thấy người dùng!';
            echo json_encode($res);
            return;
        }
    }
    else if($action == 'getTrans'){
        $offset = $data['offset'];
        $userid = $_SESSION['id'];
        $regex = '/^[0-9]+$/';
        if (!preg_match($regex, $offset)){
            $res['status'] = -2;
            $res['message'] = 'Offset không hợp lệ!';
            echo json_encode($res);
            return;
        }
        try {
            $res = getTrans($userid, $offset);
            if ($res['status'] == 0){
                $res['message'] = '';
            }
            echo json_encode($res);
            return;
        } catch (Throwable $th) {
            $res['status'] = -2;
            $res['message'] = 'Có lỗi xảy ra!';
            echo json_encode($res);
            return;
        }
    }
    else if ($action == 'getTeacherList'){
        $offset = $data['offset'];
        $limit = $data['limit'];
        $keyword = $data['keyword'];
        $regex = '/^[0-9]+$/';
        if (!preg_match($regex, $offset)){
            $res['status'] = -2;
            $res['message'] = 'Offset không hợp lệ!';
            echo json_encode($res);
            return;
        }
        if (!preg_match($regex, $limit)){
            $res['status'] = -2;
            $res['message'] = 'Limit không hợp lệ!';
            echo json_encode($res);
            return;
        }
        try {
            $res = getTeacherList($offset, $limit, $keyword);
            if ($res['status'] == 0){
                $res['message'] = '';
            }
            echo json_encode($res);
            return;
        } catch (Throwable $th) {
            $res['status'] = -2;
            $res['message'] = 'Có lỗi xảy ra!';
            echo json_encode($res);
            return;
        }
    }
    else if ($action == 'getUserList'){
        $offset = $data['offset'];
        $keyword = $data['keyword'];
        $regex = '/^[0-9]+$/';
        if (!preg_match($regex, $offset)){
            $res['status'] = -2;
            $res['message'] = 'Offset không hợp lệ!';
            echo json_encode($res);
            return;
        }
        try {
            $res = getUserList($offset, $keyword);
            if ($res['status'] == 0){
                $res['message'] = '';
            }
            echo json_encode($res);
            return;
        } catch (Throwable $th) {
            $res['status'] = -2;
            $res['message'] = 'Có lỗi xảy ra!';
            echo json_encode($res);
            return;
        }
    }
    else if ($action=='getAdminList'){
        try {
            $res = getAdminList();
            if ($res['status'] == 0){
                $res['message'] = '';
            }
            echo json_encode($res);
            return;
        } catch (Throwable $th) {
            $res['status'] = -2;
            $res['message'] = 'Có lỗi xảy ra!';
            echo json_encode($res);
            return;
        }
    }
}