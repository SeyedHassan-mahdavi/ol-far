<?php
/*
Plugin Name: WP Eita
Description: Send WordPress posts to Eita messenger automatically.
Version: 1.0
Author: Your Name
*/
// Add the admin options page
add_action('admin_menu', 'wp_eita_add_options_page');

function wp_eita_add_options_page() {
    add_options_page('WP Eita Settings', 'WP Eita', 'manage_options', 'wp_eita_settings', 'wp_eita_render_options_page');
}

// Render the options page
function wp_eita_render_options_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['wp_eita_submit'])) {
        update_option('wp_eita_bot_token', sanitize_text_field($_POST['wp_eita_bot_token']));
        update_option('wp_eita_chat_id', sanitize_text_field($_POST['wp_eita_chat_id']));
        update_option('wp_eita_pin_post', isset($_POST['wp_eita_pin_post']) ? true : false);
        update_option('wp_eita_message_format', sanitize_textarea_field($_POST['wp_eita_message_format']));
        update_option('wp_eita_max_character_limit', intval($_POST['wp_eita_max_character_limit']));
        ?>
        <div class="notice notice-success is-dismissible">
            <p><?php _e('Settings saved.', 'wp-eita'); ?></p>
        </div>
        <?php
    }

    $bot_token = get_option('wp_eita_bot_token', '');
    $chat_id = get_option('wp_eita_chat_id', '');
    $pin_post = get_option('wp_eita_pin_post', false);
    $message_format = get_option('wp_eita_message_format', '[post_title]' . "\n" . '[post_content]' . "\n" . '[post_url]');
    $max_character_limit = get_option('wp_eita_max_character_limit', 55);

    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form method="post" action="">
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="wp_eita_bot_token">Bot Token</label></th>
                    <td><input type="text" id="wp_eita_bot_token" name="wp_eita_bot_token" value="<?php echo esc_attr($bot_token); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="wp_eita_chat_id">Chat ID</label></th>
                    <td><input type="text" id="wp_eita_chat_id" name="wp_eita_chat_id" value="<?php echo esc_attr($chat_id); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="wp_eita_pin_post">Pin Post</label></th>
                    <td><input type="checkbox" id="wp_eita_pin_post" name="wp_eita_pin_post" <?php checked($pin_post, true); ?>></td>
                </tr>
                <tr>
                    <th scope="row"><label for="wp_eita_max_character_limit">Maximum Characters for Message</label></th>
                    <td><input type="number" id="wp_eita_max_character_limit" name="wp_eita_max_character_limit" value="<?php echo esc_attr($max_character_limit); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="wp_eita_message_format">Message Format</label></th>
                    <td><textarea id="wp_eita_message_format" name="wp_eita_message_format" class="regular-text"><?php echo esc_textarea($message_format); ?></textarea></td>
                </tr>
                 <tr>
                    <th scope="row">Guide to Message Format:</th>
                    <td>
                        <p>[post_id] - Post ID</p>
                        <p>[post_title] - Post Title</p>
                        <p>[post_date] - Post Date</p>
                        <p>[post_excerpt] - Post Excerpt</p>
                        <p>[post_content] - Post Content</p>
                        <p>[post_author] - Post Author</p>
                        <p>[post_category] - Post Category</p>
                        <p>[post_tags] - Post Tags</p>
                        <p>[post_url] - Shortened Post URL</p>
                    </td>
                </tr>
            </table>
            <input type="submit" name="wp_eita_submit" id="wp_eita_submit" class="button button-primary" value="Save Changes">
        </form>
    </div>
    <?php
}




// Hook into the admin_init action
add_action('admin_init', 'wp_eita_add_send_to_eita_checkbox');

function wp_eita_add_send_to_eita_checkbox() {
    // Get the post types where you want to add the checkbox
    $post_types = get_post_types(array('public' => true), 'names');

    // Add the meta box to each post type
    foreach ($post_types as $post_type) {
        add_meta_box(
            'wp_eita_send_to_eita',
            'Send to Eita',
            'wp_eita_send_to_eita_callback',
            $post_type,
            'side',
            'high'
        );
    }
}

// Render the meta box content
function wp_eita_send_to_eita_callback($post) {
    // Add a nonce field so we can check for it later
    wp_nonce_field('wp_eita_send_to_eita_nonce', 'wp_eita_send_to_eita_nonce');

    // Retrieve the current value of the send_to_eita and pin_post meta fields
    $send_to_eita = get_post_meta($post->ID, '_send_to_eita', true);
    $pin_post = get_post_meta($post->ID, '_pin_post', true);
    $disable_notification = get_post_meta($post->ID, '_disable_notification', true);


    // Check the current value of send_to_eita
    $checked_send_to_eita = ($send_to_eita == 'yes') ? 'checked' : '';

    // Check the current value of pin_post
    $checked_pin_post = ($pin_post == 'yes') ? 'checked' : '';

    // Check the current value of disable notification
    $checked_disable_notification = ($disable_notification == 'yes') ? 'checked' : '';

    // Output the checkbox for send_to_eita
    echo '<label for="wp_eita_send_to_eita">';
    echo '<input type="checkbox" id="wp_eita_send_to_eita" name="wp_eita_send_to_eita" value="yes" ' . $checked_send_to_eita . '>';
    echo 'Send to Eita';
    echo '</label>';

    // Output the checkbox for pin_post
    echo '<br>';
    echo '<label for="wp_eita_pin_post">';
    echo '<input type="checkbox" id="wp_eita_pin_post" name="wp_eita_pin_post" value="yes" ' . $checked_pin_post . '>';
    echo 'Pin Post';
    echo '</label>';

    // Output the checkbox for disable_notification
    echo '<br>';
    echo '<label for="wp_eita_disable_notification">';
    echo '<input type="checkbox" id="wp_eita_disable_notification" name="wp_eita_disable_notification" value="yes" ' . $checked_disable_notification . '>';
    echo 'disable notification';
    echo '</label>';
}

// Save the meta box data
add_action('save_post', 'wp_eita_save_send_to_eita_data');

function wp_eita_save_send_to_eita_data($post_id) {
    // Check if our nonce is set.
    if (!isset($_POST['wp_eita_send_to_eita_nonce'])) {
        return;
    }

    // Verify that the nonce is valid.
    if (!wp_verify_nonce($_POST['wp_eita_send_to_eita_nonce'], 'wp_eita_send_to_eita_nonce')) {
        return;
    }

    // If this is an autosave, our form has not been submitted, so we don't want to do anything.
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check the user's permissions.
    if (isset($_POST['post_type']) && 'page' == $_POST['post_type']) {
        if (!current_user_can('edit_page', $post_id)) {
            return;
        }
    } else {
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
    }

    // Sanitize user input.
    $send_to_eita = isset($_POST['wp_eita_send_to_eita']) ? sanitize_text_field($_POST['wp_eita_send_to_eita']) : '';
    $pin_post = isset($_POST['wp_eita_pin_post']) ? sanitize_text_field($_POST['wp_eita_pin_post']) : '';
    $disable_notification = isset($_POST['wp_eita_disable_notification']) ? sanitize_text_field($_POST['wp_eita_disable_notification']) : '';

    // Update the meta fields in the database.
    update_post_meta($post_id, '_send_to_eita', $send_to_eita);
    update_post_meta($post_id, '_pin_post', $pin_post);
    update_post_meta($post_id, '_disable_notification', $disable_notification);
}







// Add column to display send to eita status
add_filter('manage_posts_columns', 'wp_eita_add_send_to_eita_column');

function wp_eita_add_send_to_eita_column($columns) {
    $columns['send_to_eita_status'] = __('Send to Eita', 'wp-eita');
    return $columns;
}

// Display send to eita status in the column
add_action('manage_posts_custom_column', 'wp_eita_display_send_to_eita_column', 10, 2);

function wp_eita_display_send_to_eita_column($column_name, $post_id) {
    if ($column_name != 'send_to_eita_status') {
        return;
    }

    // Retrieve send to eita status
    $send_to_eita = get_post_meta($post_id, '_send_to_eita', true);

    // Output status
    if ($send_to_eita == 'yes') {
        echo '<span style="color:green;">Sent to Eita</span>';
    } else {
        echo '<span style="color:red;">Not Sent to Eita</span>';
    }

    // Output resend button if not sent
    if ($send_to_eita != 'yes') {
            echo '<br>';
            echo '<button class="button button-primary wp-eita-resend" onclick="resendToEita(' . $post_id . ')">Resend to Eita</button>';    }
}

// Enqueue JavaScript for AJAX request
add_action('admin_enqueue_scripts', 'wp_eita_enqueue_scripts');

function wp_eita_enqueue_scripts($hook) {
    if ('edit.php' !== $hook) {
        return;
    }
    wp_enqueue_script('wp-eita-admin-js', plugin_dir_url(__FILE__) . 'js/admin.js', array('jquery'), null, true);
    wp_localize_script('wp-eita-admin-js', 'wp_eita_ajax', array('ajax_url' => admin_url('admin-ajax.php')));
}
// AJAX handler to resend post to Eita
add_action('wp_ajax_resend_to_eita', 'wp_eita_ajax_resend_to_eita');

function wp_eita_ajax_resend_to_eita() {
    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    
    if (!$post_id) {
        wp_send_json_error('Invalid post ID.');
    }

    // Your logic to resend the post to Eita goes here
    // For example, you can call the send_post_to_eita function
    send_post_to_eita($post_id, get_post($post_id));

    // Update the send_to_eita meta field to reflect the new status
    update_post_meta($post_id, '_send_to_eita', 'yes');

    wp_send_json_success('Post resent to Eita successfully.');
}


function resendToEita(postId) {
    jQuery.ajax({
        url: wp_eita_ajax.ajax_url,
        type: 'POST',
        data: {
            action: 'resend_to_eita',
            post_id: postId,
        },
        success: function (response) {
            alert(response.data);
            location.reload();
        },
        error: function (error) {
            alert('Error: ' + error.responseText);
        }
    });
}



// Hook into the publish_post action
add_action('publish_post', 'send_post_to_eita', 10, 2);

function send_post_to_eita($post_ID, $post) {
    // Retrieve bot token and chat ID from options
    $bot_token = get_option('wp_eita_bot_token', '');
    $chat_id = get_option('wp_eita_chat_id', '');
    $pin_post = get_option('wp_eita_pin_post', false);
    $send_to_eita = isset($_POST['wp_eita_send_to_eita']) ? $_POST['wp_eita_send_to_eita'] : '';
    $pin_to_eita = isset($_POST['wp_eita_pin_post']) ? $_POST['wp_eita_pin_post'] : '';
    $disable_notification_eita = isset($_POST['wp_eita_disable_notification']) ? $_POST['wp_eita_disable_notification'] : '';

    // If bot token or chat ID is not set, or send to eita is not checked, do nothing
    if (empty($bot_token) || empty($chat_id) || empty($send_to_eita)) {
        return;
    }

    // Retrieve the maximum character limit from options
    $max_character_limit = get_option('wp_eita_max_character_limit', 55);

    // Prepare the message format
    $message_format = get_option('wp_eita_message_format', '**[post_title]**' . "\n" . '[post_content]' . "\n" . '[post_url]');
    $post_categories = get_the_category($post_ID);
    $post_category_names = array();
    foreach ($post_categories as $category) {
        $post_category_names[] = $category->name;
    }
    $post_category = implode(' | ', $post_category_names);

    $post_tags = get_the_tags($post_ID);
    $post_tag_names = array();
    if ($post_tags) {
        foreach ($post_tags as $tag) {
            $post_tag_names[] = '#' . str_replace(' ', '_', $tag->name);
        }
    }
    $post_tags_formatted = implode(' | ', $post_tag_names);



    $placeholders = array(
        '[post_title]' => $post->post_title,
        '[post_content]' => mb_substr($post->post_content, 0, $max_character_limit), // Get the first $max_character_limit characters
        '[post_url]' => get_permalink($post_ID),
        '[post_date]' => get_the_date('', $post_ID),
        '[post_extract]' => $post->post_extract,
        '[post_author]' => get_the_author_meta('display_name', $post->post_author),
        '[post_category]' => $post_category,
        '[post_tags]' => $post_tags_formatted,
        '[post_permalink_short]' => wp_get_shortlink($post_ID),
        '[post_featured_image]' => get_the_post_thumbnail_url($post_ID, 'full')
    );

    $formatted_message = strtr($message_format, $placeholders);

    // Check if the post has a thumbnail (featured image)
    if (has_post_thumbnail($post_ID)) {
        // Get the featured image attachment ID
        $thumbnail_id = get_post_thumbnail_id($post_ID);
        
        // Get the file path of the featured image
        $file_path = get_attached_file($thumbnail_id);

        // Check if the file exists
        if (file_exists($file_path)) {
            // Initialise the curl request
            $request = curl_init('https://eitaayar.ir/api/' . $bot_token . '/sendFile');

            // Send the message with the image file
            curl_setopt($request, CURLOPT_POST, true);
            curl_setopt($request, CURLOPT_POSTFIELDS, array(
                'file' => new CURLFile($file_path), // Provide file path of the featured image
                'caption' => $formatted_message, // Use the formatted message as caption
                'chat_id' => $chat_id,
                'pin' => $pin_to_eita ? 1 : 0, // Convert boolean to integer
                'disable_notification' => 1
            ));

            // Output the response
            curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($request);

            // Close the session
            curl_close($request);
        }
    } else {
        // If there is no featured image, send the message as text
        $request = curl_init('https://eitaayar.ir/api/' . $bot_token . '/sendMessage');
        // Send the message
        curl_setopt($request, CURLOPT_POST, true);
        curl_setopt($request, CURLOPT_POSTFIELDS, array(
            'text' => $formatted_message,
            'chat_id' => $chat_id,
            'pin' => $pin_to_eita ? 1 : 0, // Convert boolean to integer
            'disable_notification' => 1
        ));

        // Output the response
        curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($request);

        // Close the session
        curl_close($request);
    }
}